import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Header from "@/components/Header";
import Link from "next/link";

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState("");
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async (uid) => {
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
        setLoading(false); // ローディング状態を解除
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleNavigation = (url) => {
    router.push(url);
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
      <div className="container">
        <Header title={sellerName || "ダッシュボード"} />

        {/* セクション1 */}
        <section className="section">
          <ul>
            <li onClick={() => handleNavigation("/like-list")}>
              <a href="#">
                いいねリスト <span className="arrow">▶</span>
              </a>
            </li>
            <li onClick={() => handleNavigation("/listing-history")}>
              <a href="#">
                出品履歴・編集 <span className="arrow">▶</span>
              </a>
            </li>
            <li onClick={() => handleNavigation("/purchase-history")}>
              <a href="#">
                購入履歴 <span className="arrow">▶</span>
              </a>
            </li>
          </ul>
        </section>

        {/* セクション2 */}
        <section className="section">
          <ul>
            <li onClick={() => handleNavigation("/personal-information")}>
              <a href="#">
                個人情報 <span className="arrow">▶</span>
              </a>
            </li>
            <li onClick={() => handleNavigation("/points")}>
              <a href="#">
                ポイント残高 <span className="arrow">▶</span>
              </a>
            </li>
            <li onClick={() => handleNavigation("/contact-form")}>
              <a href="#">
                お問い合わせフォーム <span className="arrow">▶</span>
              </a>
            </li>
          </ul>
        </section>

        <style jsx>{`
        .container {
          font-family: Arial, sans-serif;
          margin: 0 auto;
          padding: 0 10px;
          background-color: #f9f9f9;
        }
        header {
          text-align: center;
          margin-bottom: 20px;
        }
        .section {
          margin-top: 10px;
          background-color: #fff;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
        }
        li:last-child {
          border-bottom: none;
        }
        a {
          text-decoration: none;
          color: #333;
          font-size: 18px;
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        li:hover {
          background-color: #e0f7fa;
        }
        .arrow {
          color: #666;
          font-size: 16px;
        }
      `}</style>
      </div>
  );
}
