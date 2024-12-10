import Link from 'next/link';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
    return (
        <div className={styles.card}>
            <Link href={`/Catalog/detail/${product.id}`} passHref>
                <div>
                    <img
                        src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : '/placeholder.jpg'}
                        alt={product.name}
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
