import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useShoppingCart } from 'use-shopping-cart';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';
import Header from "@/components/Header";


const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');
    const [user] = useAuthState(auth);
    const { addItem, cartDetails } = useShoppingCart();
    const [cart, setCart] = useState({});
    console.log(id)
    useEffect(() => {
        const fetchProductAndSeller = async () => {
            if (id) {
                try {
                    const productDoc = doc(db, 'products', id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);

                        const sellerId = productData.sellerId;
                        if (sellerId) {
                            const sellerDoc = doc(db, 'sellers', sellerId);
                            const sellerSnapshot = await getDoc(sellerDoc);

                            if (sellerSnapshot.exists()) {
                                const sellerData = sellerSnapshot.data();
                                setSellerName(sellerData.sellerName);
                                console.log("UserID")
                                console.log(user.uid)
                            } else {
                                setSellerName('不明');
                            }
                        } else {
                            console.log('sellerIdが見つかりません！');
                        }
                    } else {
                        console.log('商品が見つかりませんでした！');
                    }
                } catch (error) {
                    console.error('商品取得エラー:', error);
                }
            }
        };

        fetchProductAndSeller();
    }, [id]);

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
                const cartSnapshot = await getDoc(userCartRef);
                if (cartSnapshot.exists()) {
                    setCart(cartSnapshot.data().cartDetails || {});
                } else {
                    setCart({});
                }
            }
        };
        fetchCart();
    }, [user]);
    const handleAddToCart = async () => {
        if (product && user) {
            const newCart = {
                ...cart,
                [product.id]: {
                    name: product.name,
                    price: product.price,
                    quantity: (cart[product.id]?.quantity || 0) + 1,
                },
            };

            setCart(newCart);
            const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
            await setDoc(userCartRef, { cartDetails: newCart, timestamp: new Date() });
            alert(`${product.name} をカートに追加しました`);
        }
    };

    // const handlePurchase = async () => {
    //     try {
    //         const res = await fetch('api/checkout_api', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ productId: product.id })
    //         });
    //         const data = await res.json();
    //         if (data.checkout_url) {
    //             window.location.href = data.checkout_url;
    //         } else {
    //             console.error('購入手続きエラー:', data.error);
    //         }
    //     } catch (error) {
    //         console.error('購入手続きエラー:', error);
    //     }
    // };

    const purchase = () => {
        if (!product?.id) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/select-purchase',
            query: { productId: product.id },
        });
    };


    if (!product) {
        return <div>読み込み中...</div>;
    }

    return (
        <>
            <Header title={product.name} />
            <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
                {/* <BackButton/>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>{product.name}</h1> */}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {product.imageUrls && product.imageUrls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`${product.name} - 画像${index + 1}`}
                            style={{
                                width: '100%',
                                maxWidth: '250px',
                                height: 'auto',
                                borderRadius: '8px',
                                margin: '10px'
                            }}
                        />
                    ))}
                </div>

                <h2 style={{ fontSize: '1.5rem', color: '#333', marginTop: '20px' }}>詳細</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#555' }}>{product.description}</p>
                <h2 style={{ fontSize: '1.5rem', color: '#333', marginTop: '20px' }}>出品者</h2>
                <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#555' }}>{sellerName || '不明'}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                    <strong>価格:</strong> ¥{product.price.toLocaleString()}
                </p>
                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleAddToCart}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            marginRight: '10px'
                        }}
                    >
                        カートに追加
                    </button>
                    <button
                        onClick={purchase}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1rem'
                        }}
                    >
                        購入
                    </button>
                </div>
            </div>
        </>
    );
};


export default ProductDetail;