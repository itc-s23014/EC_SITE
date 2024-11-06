import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useShoppingCart } from 'use-shopping-cart';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');
    const [user] = useAuthState(auth);
    const { addItem, cartDetails } = useShoppingCart();

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
        if (user) {
            const saveCartToFirestore = async () => {
                try {
                    const userCartRef = doc(db, 'users', user.uid, 'cart', 'userCart');
                    await setDoc(userCartRef, {
                        cartDetails: cartDetails,
                        timestamp: new Date(),
                    });
                } catch (error) {
                    console.error('カートの保存エラー:', error);
                }
            };

            saveCartToFirestore();
        }
    }, [user, cartDetails]);

    const handleAddToCart = () => {
        if (product) {
            addItem({
                name: product.name,
                id: product.id,
                price: product.price ,
                currency: 'jpy',
            });
            alert(`${product.name} をカートに追加しました`);
        }
    };

    const handlePurchase = () => {

        alert('購入手続きに進みます');

    };

    if (!product) {
        return <div>読み込み中...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>{product.name}</h1>

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
                    onClick={handlePurchase}
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
    );
};

export default ProductDetail;
