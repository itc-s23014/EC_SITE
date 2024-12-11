import React from 'react';
import ProductCard from '@/components/ProductCard';
import styles from './ProductList.module.css';

const ProductList = ({ products }) => (
    <div className={styles.container}>
        {products.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
    </div>
);

export default ProductList;
