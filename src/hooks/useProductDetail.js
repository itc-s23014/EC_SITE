/**
 * 商品詳細と関連情報を管理するカスタムフック。
 * 商品、出品者情報、いいね、カートの状態を取得・更新する機能を提供。
 *
 * @param {string} id - 商品のID
 * @returns {Object} 商品情報、出品者名、いいね状態、カート情報、いいねトグル関数、カート追加関数
 */
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const useProductDetail = (id) => {
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [cart, setCart] = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        const fetchProductAndSeller = async () => {
            if (id) {
                try {
                    const productDoc = doc(db, 'products', id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);

                        const sellerId = productData.sellerId;
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

    return {
        product,
        sellerName,
        isLiked,
        cart,
        handleLikeToggle,
        handleAddToCart,
    };
};

export default useProductDetail;
