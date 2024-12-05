import { useRouter } from 'next/router';
import styles from './Header.module.css';
import Image from 'next/image';
import backIcon from '../../../public/image/back.svg';

export default function Header({ title = 'ページタイトル' }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <button onClick={() => router.back()} className={styles.backButton}>
        <Image src={backIcon} alt="戻る" width={40} height={40} />
      </button>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
