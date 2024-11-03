
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const auth = getAuth();

const Home = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();

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
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', position: 'relative' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>商品一覧</h1>


            {user && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                    <Link href="/add-product" passHref>
                        <button style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}>
                            商品追加
                        </button>
                    </Link>
                    <button onClick={handleLogout} style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}>
                        ログアウト
                    </button>
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {products.map(product => (
                    <Link key={product.id} href={`/Catalog/detail/${product.id}`} passHref>
                        <div style={{
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            width: '250px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            textDecoration: 'none'
                        }}>
                            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                            <div style={{ padding: '16px', color: 'black' }}>
                                <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>{product.name}</h2>
                                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0' }}>${product.price}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Home;
