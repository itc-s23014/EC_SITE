/**
 * ログインユーザーが「いいね」した商品のリストを取得するカスタムフック。
 *
 * @returns {Object} - likedProducts（「いいね」された商品リスト）、loading（データ取得中フラグ）、user（現在のユーザー情報）を返す。
 */

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import useUser from "./useUser";

export const useLikedProducts = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useUser();
    const likeItemCount = likedProducts.length;

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const fetchLikedProducts = async () => {
            try {
                const likesCollection = collection(db, "likes");
                const q = query(likesCollection, where("userId", "==", user.uid));
                const likesSnapshot = await getDocs(q);

                const likedProductIds = likesSnapshot.docs.map((doc) => doc.data().productId);

                if (likedProductIds.length > 0) {
                    const productsCollection = collection(db, "products");
                    const productsSnapshot = await getDocs(productsCollection);

                    const filteredProducts = productsSnapshot.docs
                        .map((doc) => ({ id: doc.id, ...doc.data() }))
                        .filter((product) => likedProductIds.includes(product.id));

                    setLikedProducts(filteredProducts);
                    console.log(filteredProducts);
                } else {
                    setLikedProducts([]);
                }
            } catch (error) {
                console.error("Error fetching liked products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedProducts();
    }, [user]);

    return { likedProducts, likeItemCount, loading, user };
};
