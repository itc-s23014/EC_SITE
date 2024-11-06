import { useShoppingCart } from 'use-shopping-cart';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useState, useEffect } from 'react';

const CartContents = () => {
    const { cartDetails, cartCount, formattedTotalPrice, emptyCart, removeItem } = useShoppingCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // ローディング状態を管理

    // 商品データを非同期で取得
    const fetchProducts = async () => {
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        const productsList = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setProducts(productsList);
        setLoading(false); // データ取得後にローディング状態を解除
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCheckout = () => {
        alert('購入されました');
        emptyCart();
    };

    if (loading) {
        return <p>Loading...</p>; // ローディング中のメッセージ
    }

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>カートの中身</h2>
            <p>商品数: {cartCount}</p>
            <p>合計金額: {formattedTotalPrice}</p>
            <ul>
                {Object.keys(cartDetails).map((key) => {
                    const item = cartDetails[key];
                    const product = products.find((product) => product.id === item.id);
                    const imageUrl = product ? product.imageUrl : '/placeholder.jpg';

                    return (
                        <li key={item.id} style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <img
                                src={imageUrl}
                                alt={item.name}
                                style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '20px' }}
                            />
                            <div>
                                <h3>{item.name}</h3>
                                <p>価格: ¥{item.price.toLocaleString()}</p>
                                <p>数量: {item.quantity}</p>
                                <p>合計: ¥{(item.price * item.quantity).toLocaleString()}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    削除
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {cartCount > 0 && (
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
                            fontSize: '1rem',
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
