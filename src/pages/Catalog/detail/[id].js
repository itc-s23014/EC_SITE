import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useShoppingCart } from 'use-shopping-cart';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';
import BackButton from "@/components/BackButton/BackButton";
import Header from "@/components/Header/Header";
import useProductDetail from '@/hooks/useProductDetail';

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [user] = useAuthState(auth);
    const { addItem, cartDetails } = useShoppingCart();
    const {
        product,
        sellerName,
        isLiked,
        cart,
        handleLikeToggle,
        handleAddToCart
    } = useProductDetail(id);
    console.log(id)


    const purchase = () => {
        if (!product?.id) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/select-purchase',
            query: { productId: product.id },
        });
    };

    if (!product) {
        return <div>読み込み中...</div>;
    }

    return (
        <>
            <Header title={product.name}/>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
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
            <div style={{maxWidth: '800px', margin: 'auto', padding: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                    <h1 style={{fontSize: '2rem', color: '#333'}}>{product.name}</h1>
                    <img
                        src={isLiked ? '/image/heart_filled_red.svg' : '/image/heart.svg'}
                        alt="いいね"
                        style={{
                            width: '40px',
                            height: '40px',
                            cursor: 'pointer',
                            marginTop: '10px',
                            filter: isLiked ? 'hue-rotate(0deg) saturate(1000%) brightness(0.8)' : 'none'
                        }}
                        onClick={handleLikeToggle}
                    />
                </div>

                <h2 style={{fontSize: '1.5rem', color: '#333', marginTop: '20px'}}>詳細</h2>
                <p style={{fontSize: '1.2rem', lineHeight: '1.6', color: '#555'}}>{product.description}</p>
                <h2 style={{fontSize: '1.5rem', color: '#333', marginTop: '20px'}}>出品者</h2>
                <p style={{fontSize: '1.2rem', lineHeight: '1.6', color: '#555'}}>{sellerName || '不明'}</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>
                    <strong>価格:</strong> ¥{product.price.toLocaleString()}
                </p>
                <div style={{textAlign: 'center'}}>
                <button
                    onClick={handleAddToCart}
                    disabled={cart[product.id]} // Disable the button if the product is already in the cart
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: cart[product.id] ? 'default' : 'pointer',
                        fontSize: '1rem',
                        marginRight: '10px',
                        opacity: cart[product.id] ? 0.5 : 1 // Make the button appear disabled visually
                    }}
                >
                    {cart[product.id] ? '追加済み' : 'カートに追加'}
                </button>

                    <button
                        onClick={purchase}
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
        </>
    );
};

export default ProductDetail;