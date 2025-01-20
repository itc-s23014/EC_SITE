import React, { useState, useEffect, useRef } from 'react';
import styles from './style.module.css';

export default function Home() {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>SHOP LOGO</div>
        <input className={styles.search} type="text" placeholder="検索" />
        <div className={styles.navIcons}>
          <span>🛒</span>
          <span>❤️</span>
          <span onClick={toggleDropdown} className={styles.settingsIcon}>⚙</span>
          <span>12,000 pt</span>
          {dropdownVisible && (
            <div ref={dropdownRef} className={styles.dropdownMenu}>
              <div className={styles.dropdownItem}>ログイン</div>
              <div className={styles.dropdownItem}>設定</div>
              <div className={styles.dropdownItem}>ログアウト</div>
            </div>
          )}
        </div>
      </header>

      <div className={styles.carousel}>
        <div className={styles.carouselItem}></div>
      </div>

      <section className={styles.section}>
        <h2>クーポン利用可能な商品</h2>
        <div className={styles.itemList}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.item}></div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>注目のおすすめ商品</h2>
        <div className={styles.itemList}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.item}></div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>カテゴリから探す</h2>
        <div className={styles.categoryList}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.category}>
              <div className={styles.categoryIcon}></div>
              <p>カテゴリ名</p>
              <span>&gt;</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>ランキング</h2>
        <div className={styles.rankList}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.rank}>
              <p>{i + 1}位</p>
              <div className={styles.rankIcon}></div>
              <p>商品名が入ります</p>
              <p>商品の説明が入ります。商品の説明が入ります。</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
