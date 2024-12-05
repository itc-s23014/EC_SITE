import styles from './Header.module.css';
import BackButton from '../BackButton/BackButton';

export default function Header({ title = 'ページタイトル' }) {
  return (
    <header className={styles.header}>
      <BackButton/>
      <h1 className={styles.title}>{title}</h1>
    </header>
  );
}
