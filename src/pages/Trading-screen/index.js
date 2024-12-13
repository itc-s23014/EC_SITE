import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from "../../../firebaseConfig";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SendMessage from '@/pages/Trading-screen/sendMessage';
import BackButton from "@/components/BackButton/BackButton";
import {getAuth} from "firebase/auth";

export default function TradePage() {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [product, setProduct] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const { productId } = router.query;
    const { user, loading: authLoading } = useAuthGuard();
    const auth = getAuth();
    const currentUser = auth.currentUser;



    useEffect(() => {
        const fetchProductData = async () => {
            try {
                let currentProductId = productId;


                if (!currentProductId && user) {
                    const notificationQuery = query(
                        collection(db, "notifications"),
                        where("sellerId", "==", currentUser.uid)
                    );
                    const notificationSnapshot = await getDocs(notificationQuery);

                    if (!notificationSnapshot.empty) {
                        const firstNotification = notificationSnapshot.docs[0].data();
                        currentProductId = firstNotification.productId;
                        console.log(currentProductId);
                        console.log(currentUser.uid);
                    }
                }


                if (currentProductId) {
                    const productDoc = doc(db, "products", currentProductId);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);
                        await notifySeller(productData);
                    } else {
                        console.log("指定された商品が存在しません。");
                    }
                }
            } catch (error) {
                console.error("商品の取得中にエラーが発生しました:", error);
            }
        };

        const notifySeller = async (productData) => {
            try {
                const notificationData = {
                    sellerId: productData.sellerId,
                    message: `商品「${productData.name}」の取引ページが開かれました。`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    productId: productId,
                };
                await addDoc(collection(db, "notifications"), notificationData);
                console.log("通知を送信しました。");
            } catch (error) {
                console.error("通知送信中にエラーが発生しました:", error);
            }
        };

        if (!authLoading) fetchProductData();
    }, [productId, authLoading, user]);

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

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (user) {
                    const notificationQuery = query(
                        collection(db, "notifications"),
                        where("sellerId", "==", user.id)
                    );
                    const notificationSnapshot = await getDocs(notificationQuery);

                    const fetchedNotifications = notificationSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setNotifications(fetchedNotifications);
                }
            } catch (error) {
                console.error("通知データの取得中にエラーが発生しました:", error);
            }
        };

        if (!authLoading) fetchNotifications();
    }, [authLoading, user]);

    return (
        <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
            <BackButton />
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', height: '200px' }}>
                <h1>取引画面</h1>
            </header>

            <div style={{ backgroundColor: '#ffffe0', padding: '16px', borderRadius: '8px', marginBottom: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <p><strong>※必須</strong> 発送者・受取側はこちらで詳細を確認ください</p>
                <a href="https://note.com/candy_f_milk/n/ncdbb4e9b98d6" target="_blank" rel="noopener noreferrer">
                    こちらをクリック
                </a>
                <p>また、URLの共有や取引者様とのやり取りなどは下のチャット機能をご利用ください。</p>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <h2>取引状況: {isConfirmed ? '確認済み' : '未確認'}</h2>
                {product && currentUser?.uid !== product.sellerId && (
                    <button
                        style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '8px' }}
                        onClick={handleConfirm}
                    >
                        確認ボタン
                    </button>
                )}
                {product && (
                    <div style={{ marginTop: '16px' }}>
                        <p><strong>商品名:</strong> {product.name}</p>
                        <p><strong>価格:</strong> ¥{product.price}</p>
                        {/*{product.imageUrls && <img src={product.imageUrls[0]} alt={product.name} style={{ maxWidth: '100%', marginTop: '8px' }} />}*/}
                    </div>
                )}

                {!product && <p>商品情報を読み込み中...</p>}

                <SendMessage />
            </div>
        </div>
    );
}
