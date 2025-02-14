import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import { useShoppingCart } from 'use-shopping-cart';
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import useProducts from '@/hooks/useProducts';
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from '@/components/Header';
import BackButton from "@/components/BackButton/BackButton";

const SelectPaymentMethod = () => {
    const {cartDetails, cartCount, formattedTotalPrice} = useShoppingCart();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [points,setpoint] = useState();
    const router = useRouter();
    const {productId} = router.query;
    const {user} = useAuthGuard();
    const products = useProducts(user);
    const [loading, setLoading] = useState(true);
    const [userid] = useAuthState(auth);


    useEffect(() => {
        if (!userid) {
            console.error('ユーザーが認証されていません');
            return;
        }

        const cartRef = doc(db, 'sellers', userid.uid, 'cart', 'currentCart');
        const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setCartItems(docSnapshot.data().cartDetails || []);
                console.log(cartItems);
            } else {
                setCartItems([]);
                console.log('nullになりました');
            }
            setLoading(false);
        });
        const pointRef = doc(db, 'sellers', userid.uid, 'points', 'allPoint');
        const unsubscribepoint = onSnapshot(pointRef, (docSnapshot) => {
            console.log(docSnapshot.data());
            if (docSnapshot.exists()) {
                const data = docSnapshot.data().point.points;
                setpoint(data)

            } else {
                setpoint(0);
            }
        });
        return () => unsubscribe(),unsubscribepoint;
    }, [userid, user]);

    useEffect(() => {
        console.log('現在のcartItems:', cartItems);
        console.log('現在のpoint',points)
        console.dir(cartItems)
        console.dir(Object.keys(cartItems))
        console.dir(Object.keys(cartItems).length)
        console.log(Object.values(cartItems))
    }, [cartItems]);

    const pushed = () => {
        if (!productId) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/convenience_store_payment',
            query: {productId},
        });
    };

    const handlePurchase = () => {
        if (!selectedMethod) {
            alert('支払い方法を選択してください');
            return;
        }
        if (selectedMethod === 'credit-card') {
            stripe_handlePurchase();
        } else if (selectedMethod === 'convenience-store') {
            pushed();
        } else if (selectedMethod === 'cash-on-delivery') {
            router.push({
                pathname: '/cash-on-delivery',
                query: {productId},
            });
        }
    };

    const stripe_handlePurchase = async () => {
        try {
            const res = await fetch('/api/cartcheckout_api', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({productId}),
            });
            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error('購入手続きエラー:', data.error);
            }
        } catch (error) {
            console.error('購入手続きエラー:', error);
        }
    };

    if (loading) {
        return <LoadingComponent/>;
    }

    return (
        <>
        <Header />
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}>
            <h1 style={{textAlign: 'center', fontSize: '1.8rem', marginBottom: '20px', color: '#333'}}>購入手続き</h1>
            <div style={{padding: '15px'}}>
                <div style={{marginBottom: '20px', fontSize: '1rem'}}>
                    <p style={{margin: 0}}>ポイントの利用</p>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: points ? '#007bff' : '#999'
                    }}>
        {points !== null && points > 0 ? `${points}P` : "ポイントがありません"}
    </span>
                </div>
                {Object.keys(cartItems).length > 0 ? (
                    <div style={{marginBottom: '20px'}}>
                        <h2>カートの中身</h2>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            {Object.values(cartItems).map((item) => {
                                // const product = products.find((prod) => prod.id === item.id);

                                return (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        marginBottom: '15px',
                                        padding: '10px',
                                        border: '1px solid #ddd',
                                        borderRadius: '10px'
                                    }}>
                                        <BackButton />
                                        <Image
                                            alt={item.name}
                                            width={60}
                                            height={60}
                                            style={{marginRight: '15px', borderRadius: '5px'}}
                                        />
                                        <div>
                                            <h3>{item?.name || '不明な商品'}</h3>
                                            <p>価格: ¥{item.price.toLocaleString()}</p>
                                            <p>数量: {item.quantity}</p>
                                            <p>合計: ¥{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p>カートが空です。</p>
                )}
                <div style={{marginBottom: '20px', fontSize: '1.1rem'}}>
                    <p>支払い方法</p>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="credit-card"
                                checked={selectedMethod === 'credit-card'}
                                onChange={() => setSelectedMethod('credit-card')}
                            />
                            クレジットカード
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="convenience-store"
                                checked={selectedMethod === 'convenience-store'}
                                onChange={() => setSelectedMethod('convenience-store')}
                            />
                            コンビニ決済
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash-on-delivery"
                                checked={selectedMethod === 'cash-on-delivery'}
                                onChange={() => setSelectedMethod('cash-on-delivery')}
                            />
                            代金引換
                        </label>
                    </div>
                </div>
                <button
                    onClick={handlePurchase}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        fontSize: '1.2rem',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    購入手続きを進める
                </button>
            </div>
        </div>
        </>
    );
}
export default SelectPaymentMethod;