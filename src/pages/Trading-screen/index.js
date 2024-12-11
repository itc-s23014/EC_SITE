import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Chat from "@/pages/Trading-screen/Chat_screen";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function TradePage() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [product, setProduct] = useState(null);
    const router = useRouter();
    const { productId } = router.query;
    const { user, loading: authloading } = useAuthGuard(); //認証を強制

    useEffect(() => {
        const fetchProductData = async () => {
            if (productId) {
                try {
                    const productDoc = doc(db, "products", productId);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);


                        await notifySeller(productData);
                    } else {
                        console.log("指定された商品が存在しません。");
                    }
                } catch (error) {
                    console.error("商品の取得中にエラーが発生しました:", error);
                }
            }
        };

        const notifySeller = async (productData) => {
            try {
                const notificationData = {
                    sellerId: productData.sellerId,
                    message: `商品「${productData.name}」の取引ページが開かれました。`,
                    timestamp: new Date().toISOString(),
                    read: false,
                };
                await addDoc(collection(db, "notifications"), notificationData);
                console.log("通知を送信しました。");
            } catch (error) {
                console.error("通知送信中にエラーが発生しました:", error);
            }
        };

        fetchProductData();
    }, [productId]);

    const handleConfirm = async () => {
        if (!product) return;

        try {

            const purchaseData = {
                productId: product.id,
                productName: product.name,
                buyerId: "currentBuyerId",
                sellerId: product.sellerId,
                purchaseDate: new Date().toISOString(),
            };
            await addDoc(collection(db, "purchaseHistory"), purchaseData);

            const notificationData = {
                sellerId: product.sellerId,
                message: `商品「${product.name}」が購入されました。`,
                timestamp: new Date().toISOString(),
                read: false,
            };
            await addDoc(collection(db, "notifications"), notificationData);

            setIsConfirmed(true);
            console.log("購入履歴と通知が保存されました。");
        } catch (error) {
            console.error("データ保存中にエラーが発生しました:", error);
        }
    };

    return (
        <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <button style={{ marginRight: '16px' }} onClick={() => window.history.back()}>← 戻る</button>
                <h1>取引画面</h1>
            </header>
            <div style={{ backgroundColor: '#ffffe0', padding: '8px', marginBottom: '16px' }}>
                <p><strong>※必須</strong> 発送者・受取側はこちらで詳細を確認ください</p>
                <a href="https://note.com/candy_f_milk/n/ncdbb4e9b98d6" target="_blank" rel="noopener noreferrer">
                    https://note.com/candy_f_milk/n/ncdbb4e9b98d6
                </a>
                <p>また、URLの共有や取引者様とのやり取りなどは下のchatをお使いください。</p>
            </div>
            <div style={{ border: '1px solid #000', padding: '8px', marginBottom: '16px' }}>
                <h2>中身確認{isConfirmed ? '完了' : '未確認'}</h2>
                <button onClick={handleConfirm}>確認ボタン</button>
                <p style={{ marginTop: '16px' }}>$</p>
                <div style={{ border: '1px solid #000', height: '50px', marginBottom: '16px', padding: '8px' }}>
                    {product ? product.name : '取引者情報を取得中...'}
                </div>
                <Chat />
            </div>
        </div>
    );
}
