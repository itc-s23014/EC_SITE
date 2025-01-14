import { useState, useEffect } from 'react';
import { auth } from '../../../firebaseConfig';
import Link from 'next/link';
import Image from "next/image";
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = auth.currentUser;
        setUser(currentUser);
        const unsubscribe = auth.onAuthStateChanged(setUser);
        // コンポーネントがアンマウントされたときに監視を解除
        return () => unsubscribe();
    }, []);

    // ログインユーザーと出品者のIDが一致する商品は表示しない
    if (user && product.sellerId === user.uid) {
        return null; // 自分が出品した商品は表示しない
    }

    return (
        <div className={styles.card}>
            <Link href={`/Catalog/detail/${product.id}`} passHref>
                <div>
                    <Image
                        src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.jpg'}
                        alt={product.name}
                        width={500}
                        height={500}
                        className={styles.image}
                    />
                    <div className={styles.content}>
                        <h2 className={styles.title}>{product.name}</h2>
                        <p className={styles.price}>${product.price}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
