import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useShoppingCart } from 'use-shopping-cart';

const auth = getAuth();

const Home = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const {cartCount} = useShoppingCart();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(productsList);
        };

        fetchProducts();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('ログアウトに失敗しました', error);
        }
    };

    return (
        <div style={{padding: '20px', backgroundColor: '#f9f9f9', position: 'relative'}}>
            <header style={{textAlign: 'center', marginBottom: '40px'}}>
                <h1 style={{fontSize: '36px', fontWeight: 'bold', marginBottom: '10px'}}>EC_SITE</h1>
                <h2 style={{fontSize: '24px', color: '#555'}}>商品一覧</h2>
            </header>

            <div style={{position: 'absolute', top: '10px', left: '10px'}}>
                <Link href="/cart" passHref>
                    <img
                        src="/image/cart.png"
                        alt="カート"
                        style={{
                            width: '75px',
                            height: '75px',
                            cursor: 'pointer',
                            borderRadius: '50%',
                        }}
                    />
                </Link>
                <span
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                >
                {cartCount}
            </span>
            <Link href="/setting-list" passHref>
                    <img
                        src="/image/setting.png"
                        alt="設定"
                        style={{
                            width: '70px',
                            height: '60px',
                            cursor: 'pointer',
                            borderRadius: '50%',
                        }}
                    />
                </Link>
            </div>

            {user ? (
                <div style={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px'}}>
                    <Link href="/add-product" passHref>
                        <img
                            src="/image/upload.png"
                            alt="商品追加"
                            style={{
                                width: '75px',
                                height: '75px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                        />
                    </Link>
                    <img
                        src="/image/logout.png"
                        alt="ログアウト"
                        onClick={handleLogout}
                        style={{
                            width: '60px',
                            height: '60px',
                            cursor: 'pointer',
                            borderRadius: '5px',
                        }}
                    />
                </div>
            ) : (
                <div style={{position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px'}}>
                    <Link href="/login" passHref>
                        <img
                            src="/image/"
                            alt="ログイン"
                            style={{
                                width: '75px',
                                height: '75px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                        />
                    </Link>
                    <Link href="/signup" passHref>
                        <img
                            src="/image/"
                            alt="新規登録"
                            style={{
                                width: '75px',
                                height: '75px',
                                cursor: 'pointer',
                                borderRadius: '5px',
                            }}
                        />
                    </Link>
                </div>
            )}

            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center'}}>
                {products.map(product => (
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
                                src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.jpg'}
                                alt={product.name}
                                style={{width: '100%', height: '150px', objectFit: 'cover'}}
                            />
                            <div style={{padding: '16px', color: 'black'}}>
                                <h2 style={{fontSize: '18px', margin: '0 0 8px'}}>{product.name}</h2>
                                <p style={{fontSize: '16px', fontWeight: 'bold', margin: '0'}}>${product.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};
    export default Home;
