import { useRouter } from 'next/router';
import Image from "next/image";
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useShoppingCart } from 'use-shopping-cart';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';
import Header from "@/components/Header/Header";
import TwitterEmbed from "@/hooks/twitter";

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');
    const [user] = useAuthState(auth);
    const [twitterUserId, setTwitterUserId] = useState('');
    const [twitterStatusId, setTwitterStatusId] = useState('');
    const { addItem, cartDetails } = useShoppingCart();
    const [cart, setCart] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [videoLink, setVideoLink] = useState('');

    useEffect(() => {
        const fetchProductAndSeller = async () => {
            if (id) {
                try {
                    const productDoc = doc(db, 'products', id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);
                        setVideoLink(productData.videoLink);
                        console.log(productData.videoLink);
                        const twitter = productData.videoLink.match(/https:\/\/twitter.com\/\w+\/status\/\d+/) || "";
                        console.log(twitter);
                        const twitterData = twitter[0].split('/');
                        setTwitterUserId(twitterData[3])
                        setTwitterStatusId(twitterData[5])
                        console.log(twitterData[3]);
                        console.log(twitterData[5]);
                        const sellerId = productData.sellerId;
                        console.log(sellerId)
                        if (sellerId) {
                            const sellerDoc = doc(db, 'sellers', sellerId);
                            const sellerSnapshot = await getDoc(sellerDoc);

                            if (sellerSnapshot.exists()) {
                                const sellerData = sellerSnapshot.data();
                                setSellerName(sellerData.sellerName);
                            } else {
                                setSellerName('不明');
                            }
                        } else {
                            console.log('sellerIdが見つかりません！');
                        }
                    } else {
                        console.log('商品が見つかりませんでした！');
                    }
                } catch (error) {
                    console.error('商品取得エラー:', error);
                }
            }
        };

        fetchProductAndSeller();
    }, [id]);

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
                const cartSnapshot = await getDoc(userCartRef);
                if (cartSnapshot.exists()) {
                    setCart(cartSnapshot.data().cartDetails || {});
                } else {
                    setCart({});
                }
            }
        };
        fetchCart();
    }, [user]);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (user && id) {
                const likeRef = doc(db, 'likes', `${user.uid}_${id}`);
                const likeSnapshot = await getDoc(likeRef);
                setIsLiked(likeSnapshot.exists());
            }
        };
        fetchLikeStatus();
    }, [user, id]);



    const handleLikeToggle = async () => {
        if (!user) {
            alert('いいねするにはログインしてください！');
            return;
        }
        const likeRef = doc(db, 'likes', `${user.uid}_${id}`);
        try {
            if (isLiked) {
                await deleteDoc(likeRef);
                setIsLiked(false);
            } else {
                await setDoc(likeRef, {
                    productId: id,
                    userId: user.uid,
                    likedAt: new Date(),
                });
                setIsLiked(true);
            }
        } catch (error) {
            console.error('いいね操作エラー:', error);
        }
    };

    const handleAddToCart = async () => {
        if (product && user && !cart[product.id]) {
            const newCart = {
                ...cart,
                [product.id]: {
                    name: product.name,
                    price: product.price,
                    quantity: (cart[product.id]?.quantity || 0) + 1,
                },
            };

            setCart(newCart);
            const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
            await setDoc(userCartRef, { cartDetails: newCart, timestamp: new Date() });
            alert(`${product.name} をカートに追加しました`);
        }
    };

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
                    <Image
                        key={index}
                        src={url}
                        alt={`${product.name} - 画像${index + 1}`}
                        width={500}
                        height={500}
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
                    <Image
                        src={isLiked ? '/image/heart_filled_red.svg' : '/image/heart.svg'}
                        alt="いいね"
                        width={500}
                        height={500}
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
                <h2 style={{fontSize: '1.5rem', color: '#333', marginTop: '20px'}}>Category</h2>
                <p style={{fontSize: '1.2rem', lineHeight: '1.6', color: '#555'}}>{product.category}</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#333'}}>
                    <strong>価格:</strong> ¥{product.price.toLocaleString()}
                </p>
               <TwitterEmbed videoLink={videoLink} twitterStatusId={twitterStatusId} twitterUserId={twitterUserId} />
                {/*<div id="twitter">*/}
                {/*    <blockquote className="twitter-tweet" data-media-max-width="560">*/}
                {/*        <a href={`https://twitter.com/${twitterUserId}/status/${twitterStatusId}?ref_src=twsrc%5Etfw`}></a>*/}
                {/*    </blockquote>*/}
                {/*    <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>*/}
                {/*</div>*/}


                <div style={{textAlign: 'center'}}>
                    <button
                        onClick={handleAddToCart}
                        disabled={cart[product.id]}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: cart[product.id] ? 'default' : 'pointer',
                            fontSize: '1rem',
                            marginRight: '10px',
                            opacity: cart[product.id] ? 0.5 : 1
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