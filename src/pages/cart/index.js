import { useShoppingCart } from 'use-shopping-cart';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebaseConfig';
import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import BackButton from "@/components/BackButton/BackButton";

const CartContents = () => {
    const { emptyCart, removeItem } = useShoppingCart();
    const [products, setProducts] = useState({});
    const [userCart, setUserCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();
    const [user] = useAuthState(auth);

    const fetchProducts = async () => {
        try {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const productMap = productsList.reduce((acc, product) => {
                acc[product.id] = product;
                return acc;
            }, {});
            setProducts(productMap);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const fetchUserCart = () => {
        if (user) {
            const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
            const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    console.log("カート情報", docSnapshot.data());
                    setUserCart(docSnapshot.data());
                } else {
                    setUserCart(null);
                }
                setLoading(false);
            });
            return unsubscribe;
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = fetchUserCart();
        return () => unsubscribe && unsubscribe();
    }, [user]);
    const handleCheckout = () => {
        alert('購入されました');
        emptyCart();
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            <BackButton/>
            <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '20px' }}>カートの中身</h2>
            {userCart && userCart.cartDetails && Object.keys(userCart.cartDetails).length > 0 ? (
                <ul style={{ padding: '0', listStyleType: 'none' }}>
                    {Object.keys(userCart.cartDetails).map((productId) => {
                        const item = userCart.cartDetails[productId];
                        const product = products[productId];
                        const imageUrl = product?.imageUrls?.[0] || '/placeholder.jpg';

                        return (
                            <li key={productId} style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#f9f9f9',
                            }}>
                                <img
                                    src={imageUrl}
                                    alt={product?.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '20px', borderRadius: '8px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.2rem', color: '#333' }}>{product?.name}</h3>
                                    <p style={{ fontSize: '1rem', color: '#555' }}>価格: ¥{product?.price?.toLocaleString()}</p>
                                    <p style={{ fontSize: '1rem', color: '#555' }}>数量: {item.quantity}</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#333' }}>合計: ¥{(product?.price * item.quantity).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => removeItem(productId)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '8px 15px',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                    }}
                                >
                                    削除
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>カートは空です</p>
            )}
            {userCart && userCart.cartDetails && Object.keys(userCart.cartDetails).length > 0 && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        onClick={handleCheckout}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            width: '100%',
                            maxWidth: '300px',
                        }}
                    >
                        購入
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartContents;