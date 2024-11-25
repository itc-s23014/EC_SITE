import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import BackButton from "@/pages/backbutton";
import { db } from "../../../firebaseConfig";

const CashOnDeliveryScreen = () => {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!productData) {
        return <div>商品が見つかりませんでした。</div>;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
            <BackButton />
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>代金引換画面</h1>

            <div
                style={{
                    backgroundColor: '#f9f9f9',
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '20px',
                }}
            >
                <p style={{ margin: '0', color: '#555', fontWeight: 'bold' }}>✔ 代金引換について</p>
                <p style={{ margin: '0', color: '#666', marginTop: '5px' }}>
                    商品受け取り時に代金をお支払いください。
                </p>
            </div>

            <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>商品情報</h2>
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '20px',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>商品名</span>
                    <span>{productData.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>商品代金</span>
                    <span>${productData.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>代金引換手数料</span>
                    <span>¥300</span>
                </div>
                <hr />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <span>合計金額</span>
                    <span>${productData.price + 300}</span>
                </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
                配送先で商品を受け取る際に現金でお支払いください。
            </p>

            <button
                style={{
                    marginTop: '20px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
                onClick={() => alert("ご注文が確定しました")}
            >
                ご注文を確定する
            </button>
        </div>
    );
};

export default CashOnDeliveryScreen;
