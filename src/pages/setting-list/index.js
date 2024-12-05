import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import Link from "next/link";

export default function UserDashboard() {
  const router = useRouter();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className="container">
      <Header title="ユーザーネーム" />

      {/* セクション1 */}
      <section className="section">
        <ul>
          <li onClick={() => handleNavigation("/like-list")}>
            <Link href="/like-list">
              <span className="link-text">いいねリスト</span>
              <span className="arrow">▶</span>
            </Link>
          </li>
          <li onClick={() => handleNavigation("/selling-history")}>
            <Link href="/selling-history">
              <span className="link-text">出品履歴・編集</span>
              <span className="arrow">▶</span>
            </Link>
          </li>
          <li onClick={() => handleNavigation("/purchase-history")}>
            <Link href="/purchase-history">
              <span className="link-text">購入履歴</span>
              <span className="arrow">▶</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* セクション2 */}
      <section className="section">
        <ul>
          <li onClick={() => handleNavigation("/personal-info")}>
            <Link href="/personal-info">
              <span className="link-text">個人情報</span>
              <span className="arrow">▶</span>
            </Link>
          </li>
          <li onClick={() => handleNavigation("/points")}>
            <Link href="/points">
              <span className="link-text">ポイント残高</span>
              <span className="arrow">▶</span>
            </Link>
          </li>
          <li onClick={() => handleNavigation("/contact-form")}>
            <Link href="/contact-form">
              <span className="link-text">お問い合わせフォーム</span>
              <span className="arrow">▶</span>
            </Link>
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
        li:hover {
          background-color: #e0f7fa;
        }

        /* リンクテキスト */
        .link-text {
          color: #333;
          font-size: 18px;
          text-decoration: none;
          flex-grow: 1; /* テキストを矢印の前に配置 */
        }

        /* アロー */
        .arrow {
          color: #666;
          font-size: 16px;
          margin-left: 10px; /* 少し余白を追加 */
        }

        /* Linkコンポーネントのスタイル */
        .section a {
          display: flex;
          text-decoration: none;
          color: inherit; /* リンクの青色を無効化 */
          justify-content: space-between;
          width: 100%;
        }

        .section a:hover {
          background-color: #e0f7fa; /* ホバー時の背景色 */
        }
      `}</style>
    </div>
  );
}
