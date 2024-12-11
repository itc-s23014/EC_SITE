'use client';

import React from 'react';
import { OrbitProgress } from 'react-loading-indicators';

const LoadingComponent = ({ color = "#32cd32", size = "large", text = "", textColor = "" }) => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center'
            }}
        >
            <OrbitProgress color={color} size={size} text={text} textColor={textColor} />
        </div>
    );
};

export default LoadingComponent;
