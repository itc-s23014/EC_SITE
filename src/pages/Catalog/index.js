import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useShoppingCart } from 'use-shopping-cart';
import ProductList from '@/components/ProductList';

const auth = getAuth();

const Home = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const { cartCount } = useShoppingCart();

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsList = productsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })).filter((product) => !product.isHidden);

            setProducts(productsList);
            setFilteredProducts(productsList);

            const uniqueCategories = [...new Set(productsList.map(product => product.category))];
            setCategories(uniqueCategories);
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (user) {
            const sellerNotificationsQuery = query(
                collection(db, 'notifications'),
                where('sellerId', '==', user.uid)
            );

            const buyerNotificationsQuery = query(
                collection(db, 'notifications'),
                where('buyer_id', '==', user.uid)
            );


            const unsubscribeSeller = onSnapshot(sellerNotificationsQuery, (snapshot) => {
                const sellerNotifications = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications((prevNotifications) => [
                    ...prevNotifications.filter((n) => n.sellerId !== user.uid),
                    ...sellerNotifications,
                ]);
            });

            const unsubscribeBuyer = onSnapshot(buyerNotificationsQuery, (snapshot) => {
                const buyerNotifications = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications((prevNotifications) => [
                    ...prevNotifications.filter((n) => n.buyer_id !== user.uid),
                    ...buyerNotifications,
                ]);
            });

            return () => {
                unsubscribeSeller();
                unsubscribeBuyer();
            };
        }
    }, [user]);


    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term) &&
            (selectedCategory ? product.category === selectedCategory : true)
        );
        setFilteredProducts(filtered);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        const filtered = products.filter((product) =>
            (category ? product.category === category : true) &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('ログアウトに失敗しました', error);
        }
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>EC_SITE</h1>
            </header>

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="商品名を検索"
                    style={{
                        padding: '10px',
                        width: '60%',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        border: 'none',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    検索
                </button>

                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '10px' }}>
                    <Link href="/cart" passHref>
                        <Image
                            src="/image/cart.svg"
                            alt="カート"
                            width={500}
                            height={500}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                    <Link href="/like-list" passHref>
                        <Image
                            src="/image/heart.svg"
                            alt="お気に入り"
                            width={500}
                            height={500}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                    <Link href="/setting-list" passHref>
                        <Image
                            src="/image/setting.svg"
                            alt="設定"
                            width={500}
                            height={500}
                            style={{
                                width: '60px',
                                height: '60px',
                                cursor: 'pointer',
                            }}
                        />
                    </Link>
                </div>

                {user ? (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                        <Link href="/add-product" passHref>
                            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>商品追加</button>
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                            }}
                        >
                            ログアウト
                        </button>
                    </div>
                ) : (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '10px' }}>
                        <Link href="/login" passHref>
                            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>ログイン</button>
                        </Link>
                        <Link href="/signup" passHref>
                            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>新規登録</button>
                        </Link>
                    </div>
                )}

                {user && notifications.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        <h3>通知</h3>
                        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    style={{
                                        backgroundColor: '#f0f0f0',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Link href="/Trading-screen" passHref>
                                        <div style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <p>{notification.message}</p>
                                            <p style={{ fontSize: '12px', color: '#888' }}>
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    style={{
                        marginLeft: '10px',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                    }}
                >
                    <option value="">すべてのカテゴリー</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <h2 style={{ fontSize: '24px', color: '#555' }}>商品一覧</h2>
            <ProductList products={filteredProducts} />
        </div>
    );
};

export default Home;