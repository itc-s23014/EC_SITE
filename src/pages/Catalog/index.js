import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ProductList from '@/components/ProductList';
import useUser from '@/hooks/useUser';
import useProducts from '@/hooks/useProducts';
import useNotifications from '@/hooks/useNotifications';

const auth = getAuth();

const Home = () => {
    const user = useUser()
    const products = useProducts()
    const notifications = useNotifications(user);
    const router = useRouter();
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
            <header style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '10px' }}>EC_SITE</h1>
                <h2 style={{ fontSize: '24px', color: '#555' }}>商品一覧</h2>
            </header>

            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '10px' }}>
                <Link href="/cart" passHref>
                    <img
                        src="/image/cart.svg"
                        alt="カート"
                        style={{
                            width: '60px',
                            height: '60px',
                            cursor: 'pointer',
                        }}
                    />
                </Link>
                <Link href="/like-list" passHref>
                    <img
                        src="/image/heart.svg"
                        alt="お気に入り"
                        style={{
                            width: '60px',
                            height: '60px',
                            cursor: 'pointer',
                        }}
                    />
                </Link>
                <Link href="/setting-list" passHref>
                    <img
                        src="/image/setting.svg"
                        alt="設定"
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
            <ProductList products={products} />
        </div>
    );
};

export default Home;
