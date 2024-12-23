/**
 * Firestoreから商品情報を取得するカスタムフック。
 * 商品削除機能を含む。
 *
 * @returns {Object} - 商品データ配列と削除関数
 */
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const useProducts = (user) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const productsRef = collection(db, "products");
            let q;

            if (user) {
                // ユーザー指定がある場合、条件を追加
                q = query(productsRef, where("sellerId", "==", user.uid));
            } else {
                // ユーザー指定がない場合、すべての商品を取得
                q = query(productsRef);
            }

            const querySnapshot = await getDocs(q);
            const productList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(productList);
        };

        fetchProducts();
    }, [user]);

    /**
     * 商品を削除する関数
     * @param {string} productId - 削除する商品のID
     */
    const deleteProduct = async (productId) => {
        try {
            const productDoc = doc(db, "products", productId);
            await deleteDoc(productDoc);

            // 削除後のデータを更新
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product.id !== productId)
            );
        } catch (error) {
            console.error("商品削除中にエラーが発生しました:", error);
        }
    };

    return { products, deleteProduct };
};

export default useProducts;
