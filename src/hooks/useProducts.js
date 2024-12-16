/**
 * 指定されたユーザーが出品した商品をFirestoreから取得するカスタムフック。
 * Firestoreの「products」コレクションで、`sellerId` がユーザーのUIDと一致する商品を取得する。
 *
 * @returns {Array} products - 商品の配列。各商品はIDとそのデータを含むオブジェクト。
 */
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const useProducts = (user) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (user) {
                const q = query(
                    collection(db, "products"),
                    where("sellerId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const productList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
            }
        };
        fetchProducts();
    }, [user]);

    return products;
};

export default useProducts;
