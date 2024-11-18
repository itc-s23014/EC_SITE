// components/Header.js
import { useRouter } from 'next/router';
import styles from './Header.module.css'; // モジュールCSSをインポート

export default function Header({ title }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <button onClick={() => router.back()} className={styles.backButton}>
        ← 戻る
      </button>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
