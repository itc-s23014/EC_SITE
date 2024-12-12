import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import BackButton from "@/components/BackButton/BackButton";
import {db} from '../../../firebaseConfig'
import LoadingComponent from '@/components/LoadingComponent';


const PaymentScreen = () => {
    const router = useRouter();
    const { productId } = router.query;
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;

        const fetchProductData = async () => {
            try {
                const productRef = doc(db, "products", productId);
                const productSnap = await getDoc(productRef);
                console.log(productSnap.data());
                if (productSnap.exists()) {
                    setProductData(productSnap.data());
                } else {
                    console.error("No such product");
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [productId]);
    useEffect(() => {
        if (productData) {
            console.log("Updated productData:", productData);
        }
    }, [productData]);

    if (loading) {
        return <LoadingComponent />
    }

    if (!productData) {
        return <div>商品が見つかりませんでした。</div>;
    }
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
            <BackButton/>
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>取引画面</h1>

            <div
                style={{
                    backgroundColor: '#fffbe8',
                    border: '1px solid #ffcc00',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '20px',
                }}
            >
                <p style={{ margin: '0', color: '#ff6600', fontWeight: 'bold' }}>✔ 支払いをしてください</p>
                <p style={{ margin: '0', color: '#666', marginTop: '5px' }}>
                    20XX年XX月X日(◯) 23時59分までに必ずお支払いください。
                </p>
            </div>

            <a
                href="#"
                style={{
                    textAlign: 'right',
                    display: 'block',
                    color: '#007aff',
                    textDecoration: 'none',
                    marginBottom: '20px',
                }}
            >
                購入した後の流れ →
            </a>

            <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>支払い情報</h2>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '20px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>商品代金</span>
                    <span>${productData.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>コンビニ/ATM手数料</span>
                    <span>¥100</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <span>支払い金額</span>
                    <span>${productData.price + 100}</span>
                </div>
            </div>

            <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>支払い方法</h2>
            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                お支払いに必要な番号を発行しました。下記に沿ってお支払いを行ってください。
            </p>
            <a href="#" style={{ color: '#007aff', textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
                ローソンでのお支払い方法はこちら →
            </a>

            <div
                style={{
                    backgroundColor: '#fffbe8',
                    border: '1px solid #ffcc00',
                    borderRadius: '10px',
                    padding: '15px',
                }}
            >
                <p style={{ margin: '0', fontWeight: 'bold' }}>セイコーマート</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: '#333' }}>受付番号 : 247110</p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>確認番号 : EC08540169</p>
            </div>

            <button
                style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ff6666',
                    color: '#fff',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                onClick={() => alert('支払い方法を変更します')}
            >
                支払い方法を変更する
            </button>
        </div>
    );
};

export default PaymentScreen;