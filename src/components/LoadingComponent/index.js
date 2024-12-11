'use client';

import React, { useState, useEffect } from 'react';
import { OrbitProgress } from 'react-loading-indicators';

const LoadingComponent = ({
    color = "#32cd32",
    size = "medium",
    text = "",
    textColor = "",
    delay = 300,  // ローディング表示遅延 (ミリ秒)
    overlay = true  // オーバーレイ背景の追加
}) => {
    const [showLoading, setShowLoading] = useState(false);
    const [dynamicSize, setDynamicSize] = useState(size);

    // クライアントサイドでのみwindowを使用する
    useEffect(() => {
        // windowがクライアントサイドでのみ使用可能
        if (typeof window !== 'undefined') {
            const newSize = window.innerWidth < 600 ? "small" : size;
            setDynamicSize(newSize);
        }
    }, [size]);  // sizeが変わる度に動的サイズを更新

    // ローディング表示の遅延
    useEffect(() => {
        const timer = setTimeout(() => setShowLoading(true), delay);
        return () => clearTimeout(timer); // クリーンアップ
    }, [delay]);

    if (!showLoading) {
        return null; // ローディング表示しない
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            position: 'relative',
        }}>
            {overlay && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',  // 半透明の背景
                        zIndex: '999',
                    }}
                />
            )}
            <div>
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
