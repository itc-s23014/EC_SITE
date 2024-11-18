import { useRouter } from "next/router";
import Backbutton from "@/pages/backbutton";

export default function UserDashboard() {
  const router = useRouter();

  const handleNavigation = (url) => {
    router.push(url);
  };

  return (
    <div className="container">
      <header>
        <Backbutton />
        <h1>購入手続き</h1>
      </header>

      {/* セクション1 */}
      <section className="section">
        <ul>
          <li onClick={() => handleNavigation("/like-list")}>
            <a href="/like-list">
              いいねリスト <span className="arrow">▶</span>
            </a>
          </li>
          <li onClick={() => handleNavigation("/selling-history")}>
            <a href="/selling-history">
              出品履歴・編集 <span className="arrow">▶</span>
            </a>
          </li>
          <li onClick={() => handleNavigation("/purchase-history")}>
            <a href="/purchase-history">
              購入履歴 <span className="arrow">▶</span>
            </a>
          </li>
        </ul>
      </section>

      {/* セクション2 */}
      <section className="section">
        <ul>
          <li onClick={() => handleNavigation("/personal-info")}>
            <a href="/personal-info">
              個人情報 <span className="arrow">▶</span>
            </a>
          </li>
          <li onClick={() => handleNavigation("/points")}>
            <a href="/points">
              ポイント残高 <span className="arrow">▶</span>
            </a>
          </li>
          <li onClick={() => handleNavigation("/contact-form")}>
            <a href="/contact-form">
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
          transition: background-color 0.2s ease;
          pointer-events: none; /* a要素のクリックイベントを無効化 */
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
