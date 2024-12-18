/**
 * uidからユーザーデータとセラー名を取得するカスタムフック
 *
 * @returns {Object} - ユーザーデータ、セラー名、読み込み状態を含むオブジェクト
 *   - userData: ユーザーのデータ (nullの場合もあり)
 *   - sellerName: セラーの名前 (文字列)
 *   - loading: データの取得中かどうかを示すフラグ (true または false)
 */

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const useUserData = (uid) => {
    const [userData, setUserData] = useState(null);
    const [sellerName, setSellerName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!uid) return;

        const fetchUserData = async () => {
            try {
            // usersコレクションからUIDでデータを取得
            const userQuery = query(collection(db, "users"), where("userId", "==", uid));
            const userSnapshot = await getDocs(userQuery);

            // sellersコレクションからUIDでデータを取得
            const sellerDoc = doc(db, "sellers", uid);
            const sellerSnapshot = await getDoc(sellerDoc);

            if (sellerSnapshot.exists()) {
                const sellerData = sellerSnapshot.data();
                setSellerName(sellerData.sellerName); // 名前を設定
            } else {
                console.error("セラーデータが見つかりませんでした");
                }

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                setUserData({ id: userDoc.id, ...userDoc.data() }); // ドキュメントデータを設定
            } else {
                console.error("ユーザーデータが見つかりませんでした");
                }
            } catch (error) {
                console.error("ユーザーデータの取得中にエラーが発生しました", error);
                } finally {
                    setLoading(false);
                    }
            };
                fetchUserData();
        }, [uid]);

    return { userData, sellerName, loading };
};
