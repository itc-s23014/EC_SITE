/**
 * ユーザーの購入履歴を取得するカスタムフック。
 *
 * @returns {Object}
 *   - purchasedProducts {Array<Object>} : 購入商品情報。
 *   - loading {boolean} : ローディング状態。
 *   - error {Error|null} : エラー情報。
 */

import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import useUser from "./useUser";

export const usePurchaseHistory = () => {
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchPurchasedProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const purchasesCollection = collection(db, "purchases");
                const q = query(purchasesCollection, where("userId", "==", user.uid));
                const purchasesSnapshot = await getDocs(q);

                const purchasedProductIds = purchasesSnapshot.docs.map((doc) => doc.data().productId);

                if (purchasedProductIds.length > 0) {
                    const productsCollection = collection(db, "products");
                    const productsSnapshot = await getDocs(productsCollection);

                    const filteredProducts = productsSnapshot.docs
                        .map((doc) => ({ id: doc.id, ...doc.data() }))
                        .filter((product) => purchasedProductIds.includes(product.id));

                    if (isMounted) {
                        setPurchasedProducts(filteredProducts);
                    }
                } else {
                    if (isMounted) {
                        setPurchasedProducts([]);
                    }
                }
            } catch (err) {
                console.error("購入履歴の取得中にエラーが発生しました:", err);
                if (isMounted) {
                    setError(err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPurchasedProducts();

        return () => {
            isMounted = false;
        };
    }, [user]);

    return { purchasedProducts, loading, error };
};
