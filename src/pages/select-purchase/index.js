// pages/select-payment-method.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SelectPaymentMethod() {
    const [selectedMethod, setSelectedMethod] = useState('');
    const router = useRouter();

    const handlePurchase = () => {
        if (!selectedMethod) return;

    switch (selectedMethod) {
        case 'credit-card':
            router.push('/purchase/credit-card');
            break;
        case 'convenience-store':
            router.push('/purchase/convenience-store');
            break;
        case 'cash-on-delivery':
            router.push('/purchase/cash-on-delivery');
            break;
        default:
            alert('支払い方法を選択してください');
        }
    };

    return (
        <div className="container">
        {/* ヘッダー */}
        <header>
            <button onClick={() => router.back()} className="back-button">← 戻る</button>
            <h1>購入手続き</h1>
        </header>

        {/* コンテンツ */}
        <div className="content">
            {/* ポイント利用のセクション */}
        <div className="points-section">
            <p>ポイントの利用</p>
            <p className="points">P0</p>
        </div>

        {/* 支払い方法のセクション */}
        <div className="payment-method-section">
            <p className="section-title">支払い方法</p>
            <div className="radio-group">
            <label className="radio-option">
                <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={selectedMethod === 'credit-card'}
                    onChange={() => setSelectedMethod('credit-card')}
                />
                クレジットカード
            </label>
            <label className="radio-option">
                <input
                    type="radio"
                    name="paymentMethod"
                    value="convenience-store"
                    checked={selectedMethod === 'convenience-store'}
                    onChange={() => setSelectedMethod('convenience-store')}
                />
                コンビニ/ATM
            </label>
            <label className="radio-option">
                <input
                    type="radio"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={selectedMethod === 'cash-on-delivery'}
                    onChange={() => setSelectedMethod('cash-on-delivery')}
                />
                代金交換
            </label>
            </div>
        </div>

        {/* 購入ボタン */}
        <button
            onClick={handlePurchase}
            className={`purchase-button ${selectedMethod ? 'enabled' : ''}`}
            disabled={!selectedMethod}
        >
            購入
        </button>
        </div>

        <style jsx>{`
            .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            min-height: 100vh;
            font-family: Arial, sans-serif;
        }
        header {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 20px;
            border-bottom: 1px solid #ddd;
        }
        .back-button {
            position: absolute;
            left: 20px;
            font-size: 16px;
            color: #333;
            background: none;
            border: none;
            cursor: pointer;
        }
        h1 {
            font-size: 20px;
            margin: 0;
        }
        .content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            flex-grow: 1;
            width: 100%;
        }
        .points-section {
            width: 100%;
            max-width: 600px;
            border-bottom: 1px solid #ddd;
            padding: 20px 0;
            margin-bottom: 20px;
            text-align: left;
        }
        .points {
            font-weight: bold;
            font-size: 16px;
            text-align: left;
        }
        .payment-method-section {
            width: 100%;
            max-width: 600px;
            margin-bottom: 20px;
            text-align: left;
        }
        .section-title {
            font-size: 18px;
            margin-bottom: 10px;
        }
        .radio-group {
            display: flex;
            flex-direction: column;
        }
        .radio-option {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .radio-option input {
            margin-right: 10px;
        }
        .purchase-button {
            width: 100%;
            max-width: 600px;
            padding: 12px;
            font-size: 16px;
            background-color: #ccc;
            border: none;
            border-radius: 5px;
            color: #fff;
            cursor: not-allowed;
            text-align: center;
            transition: background-color 0.3s;
        }
        .purchase-button.enabled {
          background-color: #0070f3; /* ボタンが青くなる */
            cursor: pointer;
        }
        `}</style>
    </div>
    );
}
