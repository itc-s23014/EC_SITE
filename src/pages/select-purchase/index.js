import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useShoppingCart } from 'use-shopping-cart';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from "../../../firebaseConfig";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function SelectPaymentMethod() {
    const { cartDetails, cartCount, formattedTotalPrice, emptyCart } = useShoppingCart();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [directProduct, setDirectProduct] = useState(null);
    const router = useRouter();
    const { productId } = router.query;
    const { user, loading: authloading } = useAuthGuard(); //認証を強制


    const fetchProducts = async () => {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(productsList);
        setLoading(false);
    };

    const fetchDirectProduct = async () => {
        if (!productId) return;
        const productRef = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
            setDirectProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
            console.error('商品が見つかりませんでした');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (productId) {
                await fetchDirectProduct();
            } else {
                await fetchProducts();
            }
            setLoading(false); // データの取得が完了したらloadingをfalseにする
        };

        fetchData();
    }, [productId]);

    const pushed = () => {
        if (!productId) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/convenience_store_payment',
            query: { productId },
        });
    };

    const handlePurchase = () => {
        if (!selectedMethod) return;
        if (selectedMethod === 'credit-card') {
            stripe_handlePurchase();
        } else if (selectedMethod === 'convenience-store') {
            pushed();
        } else if (selectedMethod === 'cash-on-delivery') {
            router.push({
                pathname: '/cash-on-delivery',
                query: { productId }
            });
        } else {
            alert('支払い方法を選択してください');
        }
    };

    const stripe_handlePurchase = async () => {
        try {
            const res = await fetch('/api/checkout_api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
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
        return <LoadingComponent />
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '20px', color: '#333' }}>購入手続き</h1>
            <div style={{ padding: '15px' }}>
                <div style={{ marginBottom: '20px', fontSize: '1rem' }}>
                    <p style={{ margin: 0 }}>ポイントの利用</p>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#007bff' }}>P0</span>
                </div>
                {productId && directProduct ? (
                    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px' }}>
                        <h2>選択された商品</h2>
                        <p>商品名: {directProduct.name}</p>
                        <p>価格: ¥{directProduct.price.toLocaleString()}</p>
                    </div>
                ) : (
                    <div style={{ marginBottom: '20px' }}>
                        <h2>カートの中身</h2>
                        <p>商品数: {cartCount}</p>
                        <p>合計金額: {formattedTotalPrice}</p>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {Object.keys(cartDetails).map((key) => {
                                const item = cartDetails[key];
                                const product = products.find((prod) => prod.id === item.id);
                                const imageUrl = product?.imageUrls?.[0] || '/placeholder.jpg';

                                return (
                                    <div key={item.id} style={{ display: 'flex', marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '10px' }}>
                                        <img
                                            src={imageUrl}
                                            alt={item.name}
                                            style={{ width: '60px', height: '60px', marginRight: '15px', borderRadius: '5px' }}
                                        />
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p>価格: ¥{item.price.toLocaleString()}</p>
                                            <p>数量: {item.quantity}</p>
                                            <p>合計: ¥{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
                    <p>支払い方法</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label style={{ fontSize: '1rem' }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="credit-card"
                                checked={selectedMethod === 'credit-card'}
                                onChange={() => setSelectedMethod('credit-card')}
                                style={{ marginRight: '10px' }}
                            />
                            クレジットカード
                        </label>
                        <label style={{ fontSize: '1rem' }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="convenience-store"
                                checked={selectedMethod === 'convenience-store'}
                                onChange={() => setSelectedMethod('convenience-store')}
                                style={{ marginRight: '10px' }}
                            />
                            コンビニ決済
                        </label>
                        <label style={{ fontSize: '1rem' }}>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash-on-delivery"
                                checked={selectedMethod === 'cash-on-delivery'}
                                onChange={() => setSelectedMethod('cash-on-delivery')}
                                style={{ marginRight: '10px' }}
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
    );
}
