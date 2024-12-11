'use client';

import React, { useState, useEffect } from 'react';
import { OrbitProgress } from 'react-loading-indicators';
import styles from './LoadingComponent.module.css'; // CSSモジュールをインポート

const LoadingComponent = ({
    color = "#32cd32",
    size = "medium",
    text = "",
    textColor = "",
    delay = 300, // ローディング表示遅延 (ミリ秒)
    overlay = true // オーバーレイ背景の追加
}) => {
    const [showLoading, setShowLoading] = useState(false);
    const [dynamicSize, setDynamicSize] = useState(size);

    // クライアントサイドでのみwindowを使用する
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const newSize = window.innerWidth < 600 ? "small" : size;
            setDynamicSize(newSize);
        }
    }, [size]);

    // ローディング表示の遅延
    useEffect(() => {
        const timer = setTimeout(() => setShowLoading(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!showLoading) {
        return null;
    }

    return (
        <div className={styles.container}>
            {overlay && <div className={styles.overlay} />}
            <div className={styles.content}>
                <OrbitProgress
                    color={color}
                    size={dynamicSize}
                    text={text}
                    textColor={textColor}
                />
            </div>
        </div>
    );
};

export default LoadingComponent;
