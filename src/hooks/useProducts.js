/**
 * Firestoreから商品情報を取得するカスタムフック。
 * - ユーザーが指定された場合: 指定されたユーザーが出品した商品のみ取得。
 * - ユーザーが指定されない場合: すべての商品を取得。
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
            // Firestoreクエリを準備
            const productsRef = collection(db, "products");
            let q;

            if (user) {
                // ユーザー指定がある場合、条件を追加
                q = query(productsRef, where("sellerId", "==", user.uid));
            } else {
                // ユーザー指定がない場合、すべての商品を取得
                q = query(productsRef);
            }

            // Firestoreからデータを取得
            const querySnapshot = await getDocs(q);
            const productList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setProducts(productList);
        };

        fetchProducts();
    }, [user]);

    return products;
};

export default useProducts;
