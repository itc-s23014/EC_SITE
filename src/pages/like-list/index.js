import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

const LikeList = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        // ユーザー認証の確認
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                fetchLikedProducts(currentUser.uid);
            } else {
                setLoading(false); // ログインしていない場合
            }
        });
    }, []);

    const fetchLikedProducts = async (userId) => {
        try {
            // "likes"コレクションからユーザーが「いいね」した商品を取得
            const likesQuery = query(
                collection(db, 'likes'),
                where('userId', '==', userId)
            );
            const likesSnapshot = await getDocs(likesQuery);

            const productIds = likesSnapshot.docs.map((doc) => doc.data().productId);

            // 商品情報を取得
            const productsQuery = query(
                collection(db, 'products'),
                where('__name__', 'in', productIds)
            );
            const productsSnapshot = await getDocs(productsQuery);

            const productsList = productsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setLikedProducts(productsList);
        } catch (error) {
            console.error('Error fetching liked products:', error);
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
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Like List
                </h1>
                <h2 style={{ fontSize: '24px', color: '#555' }}>
                    あなたが「いいね」した商品
                </h2>
            </header>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {likedProducts.length > 0 ? (
                    likedProducts.map((product) => (
                        <Link key={product.id} href={`/Catalog/detail/${product.id}`} passHref>
                            <div
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    backgroundColor: 'white',
                                    width: '250px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    textDecoration: 'none',
                                }}
                            >
                                <img
                                    src={
                                        product.imageUrls && product.imageUrls.length > 0
                                            ? product.imageUrls[0]
                                            : '/placeholder.jpg'
                                    }
                                    alt={product.name}
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '16px', color: 'black' }}>
                                    <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>
                                        {product.name}
                                    </h2>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>
                                        ¥{product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>「いいね」した商品がありません。</p>
                )}
            </div>
        </div>
    );
};

export default LikeList;
