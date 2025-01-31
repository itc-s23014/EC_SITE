/**
 * ユーザーのカート情報と商品情報を管理するカスタムフック。
 *
 * @param {Object} user - 現在のユーザー情報。
 * @returns {Object} - カート情報、商品情報、ローディング状態、カートからアイテムを削除する関数を含むオブジェクト。
 */

import { useState, useEffect } from 'react';
import { collection, doc, getDocs, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const useCart = (user) => {
    const [products, setProducts] = useState({});
    const [userCart, setUserCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 商品の情報を取得する
        const fetchProducts = async () => {
            try {
                const productsCollection = collection(db, 'products');
                const productsSnapshot = await getDocs(productsCollection);
                const productsList = productsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const productMap = productsList.reduce((acc, product) => {
                    acc[product.id] = product;
                    return acc;
                }, {});
                setProducts(productMap);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        // ユーザーのカート情報を取得する
        const fetchUserCart = () => {
            if (user) {
                const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
                const unsubscribe = onSnapshot(userCartRef, async (docSnapshot) => {
                    if (docSnapshot.exists()) {
                        const cartData = docSnapshot.data();
                        setUserCart(cartData);

                        // isHidden が true の商品を削除
                        const hiddenProductIds = Object.keys(cartData.cartDetails || {}).filter(
                            (productId) => products[productId]?.isHidden
                        );
                        if (hiddenProductIds.length > 0) {
                            const updates = {};
                            hiddenProductIds.forEach((productId) => {
                                updates[`cartDetails.${productId}`] = deleteField();
                            });
                            await updateDoc(userCartRef, updates);
                        }
                    } else {
                        setUserCart(null);
                    }
                    setLoading(false);
                });
                return unsubscribe;
            } else {
                setLoading(false);
            }
        };

        fetchProducts().then(fetchUserCart);
        const unsubscribe = fetchUserCart();
        return () => unsubscribe && unsubscribe();
    }, [user, products]);

    // カートからアイテムを削除する
    const removeItemFromCart = async (productId) => {
        if (user) {
            try {
                const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
                await updateDoc(userCartRef, {
                    [`cartDetails.${productId}`]: deleteField(),
                });
                console.log(`${productId} has been removed from the cart`);
            } catch (error) {
                console.error('Error removing item from cart:', error);
            }
        }
    };

    return { products, userCart, loading, removeItemFromCart };
};

export default useCart;
