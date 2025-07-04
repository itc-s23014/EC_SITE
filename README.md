## 📦 ECサイト概要

本サイトは、**個人間での販売・買取**を可能にするショッピング兼販売プラットフォームです。  
出品者が商品を自由に掲載し、購入希望者とやり取りができる仕組みになっています。

### 🎥 特徴（他サービスとの違い）

本サービスの最大の特徴は、**出品時に動画を投稿できる点**です。  
これにより、以下のようなメリットがあります：

- 写真だけでは伝わりにくい商品の状態や使用感を、**動画で視覚的に共有**できる  
- 説明しにくい細かな部分も、**実際の動作や質感を見せることで理解しやすくなる**  
- 購入者にとっては、**安心して購入判断ができる**材料となる

---

## 🛠 使用技術一覧

### フロントエンド
<p>
  <img src="https://img.shields.io/badge/-JavaScript-F7DF1E.svg?logo=javascript&style=for-the-badge&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=next.js&style=for-the-badge" alt="Next.js">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/-TailwindCSS-38B2AC.svg?logo=tailwindcss&style=for-the-badge" alt="Tailwind CSS">
</p>

### バックエンド / データベース
<p>
  <img src="https://img.shields.io/badge/-Firebase Firestore-FFCA28.svg?logo=firebase&style=for-the-badge" alt="Firebase Firestore">
  <img src="https://img.shields.io/badge/-Firebase Authentication-FFCA28.svg?logo=firebase&style=for-the-badge" alt="Firebase Authentication">
  <img src="https://img.shields.io/badge/-Firebase Storage-FFCA28.svg?logo=firebase&style=for-the-badge" alt="Firebase Storage">
</p>

### 外部API（決済システム）
<p>
  <img src="https://img.shields.io/badge/-Stripe-008CDD.svg?logo=stripe&style=for-the-badge" alt="Stripe">
</p>

✅ **Stripe API を利用し、クレジットカード決済を実装しました。**  
詳細については、以下のリンクから **Payments** を参照してください。

🔗 [Stripe API ドキュメント](https://docs.stripe.com/?locale=ja-JP#products)

※ ほとんどは test ブランチから merge していますが、別ブランチで作業後、一旦 test ブランチに merge して動作確認を行い、その後 main ブランチに merge するフローで運用しています。
