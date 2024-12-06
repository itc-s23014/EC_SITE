import { useShoppingCart } from 'use-shopping-cart';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

const LikeList = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { cartDetails, cartCount, formattedTotalPrice, emptyCart, removeItem } = useShoppingCart();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();


        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {

                fetchLikedProducts(currentUser.uid);
            } else {

                setLoading(false);
            }
        });


        return () => unsubscribe();
    }, []);

    const fetchLikedProducts = async (uid) => {
        try {

            const likesCollection = collection(db, 'likes');
            const q = query(likesCollection, where('userId', '==', uid));
            const likesSnapshot = await getDocs(q);


            const likedProductIds = likesSnapshot.docs.map((doc) => doc.data().productId);

            if (likedProductIds.length > 0) {

                const productsCollection = collection(db, 'products');
                const productsSnapshot = await getDocs(productsCollection);


                const filteredProducts = productsSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((product) => likedProductIds.includes(product.id));

                setLikedProducts(filteredProducts);
            } else {

                setLikedProducts([]);
            }
        } catch (error) {
            console.error('fetching liked products:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>ログインしてください。</p>;
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Like List
                </h1>
                <h2 style={{ fontSize: '24px', color: '#555' }}>
                    あなたが「いいね」した商品
                </h2>
            </header>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                }}
            >
                {likedProducts.length > 0 ? (
                    likedProducts.map((product) => (
                        <Link key={product.id} href={`/Catalog/detail/${product.id}`} passHref>
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    backgroundColor: '#fff',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    textDecoration: 'none',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.03)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                {/* 商品画像 */}
                                <img
                                    src={
                                        product.imageUrls && product.imageUrls.length > 0
                                            ? product.imageUrls[0]
                                            : '/placeholder.jpg'
                                    }
                                    alt={product.name}
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        maxWidth: '150px',
                                        aspectRatio: '4 / 3',
                                        objectFit: 'cover',
                                        margin: '0 auto',
                                        borderBottom: '1px solid #ddd',
                                        borderRadius: '10px',
                                    }}
                                />

                                {/* 商品情報 */}
                                <div style={{ padding: '16px', color: '#333' }}>
                                    <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>
                                        {product.name}
                                    </h2>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', color: '#666' }}>
                                        ¥{product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#777' }}>「いいね」した商品がありません。</p>
                )}
            </div>
        </div>
    );
};

export default LikeList;
