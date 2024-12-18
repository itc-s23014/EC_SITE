/**
 * uidからユーザーデータとセラーデータを取得するカスタムフック
 *
 * @param {string} uid - Firebase Authentication の UID
 * @returns {Object} - ユーザーデータ、セラーデータ、読み込み状態を含むオブジェクト
 *   - userData: ユーザーのデータ (nullの場合もあり)
 *   - sellerData: セラーのデータ (nullの場合もあり)
 *   - loading: データの取得中かどうかを示すフラグ (true または false)
 *   - error: エラー情報 (null またはエラーメッセージ)
 */

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useUserData } from "./useUserData"; // 既存のフックをインポート
import { db } from "../../firebaseConfig";

export const useSellerAndUserData = (uid) => {
    const { userData, sellerName, loading: userLoading } = useUserData(uid); // useUserDataを利用
    const [sellerData, setSellerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid || userLoading) return; // uidがない、またはuserLoading中なら処理をスキップ

        const fetchSellerData = async () => {
            try {
                const sellerDoc = doc(db, "sellers", uid);
                const sellerSnapshot = await getDoc(sellerDoc);

                if (sellerSnapshot.exists()) {
                    setSellerData(sellerSnapshot.data());
                } else {
                    console.error("セラーデータが見つかりませんでした");
                    setError("セラーデータが見つかりませんでした");
                }
            } catch (error) {
                console.error("セラーデータの取得中にエラーが発生しました", error);
                setError("セラーデータの取得中にエラーが発生しました");
            } finally {
                setLoading(false);
            }
        };

        fetchSellerData();
    }, [uid, userLoading]);

    return { userData, sellerData, sellerName, loading, error };
};
