import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from "../../../firebaseConfig";
import { doc, getDoc, addDoc, collection, query, where, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import SendMessage from '@/pages/Trading-screen/sendMessage';
import BackButton from "@/components/BackButton/BackButton";
import { getAuth } from "firebase/auth";
import useProducts from "@/hooks/useProducts";
import BackButtonHome from "@/components/BackButton/BackButtonHome";

const  TradePage = () => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [product, setProduct] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const { productId } = router.query;
    const { user, loading: authLoading } = useAuthGuard();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [sellername, setsellername] = useState(null);
    const { products, deleteProduct } = useProducts(currentUser);
    const [tradingPageId,settradingPageId] = useState(null)

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                let currentProductId = productId;

                if (!currentProductId && user) {
                    const sellerQuery = query(
                        collection(db, "notifications"),
                        where("sellerId", "==", user.uid)
                    );

                    const buyerQuery = query(
                        collection(db, "notifications"),
                        where("buyer_id", "==", currentUser.uid)
                    );

                    const [sellerSnapshot, buyerSnapshot] = await Promise.all([
                        getDocs(sellerQuery),
                        getDocs(buyerQuery)
                    ]);

                    if (!sellerSnapshot.empty) {
                        const firstNotification = sellerSnapshot.docs[0].data();
                        currentProductId = firstNotification.productId;
                    } else if (!buyerSnapshot.empty) {
                        const firstNotification = buyerSnapshot.docs[0].data();
                        currentProductId = firstNotification.productId;
                    }
                }

                if (currentProductId) {
                    const productDoc = doc(db, "products", currentProductId);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);
                        await updateDoc(productDoc, { isHidden: true });
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
                // 通知データの基本情報
                const notificationData = {
                    sellerId: productData.sellerId,
                    message: `商品「${productData.name}」の取引ページが開かれました。`,
                    timestamp: new Date().toISOString(),
                    read: false,
                    productId: productData.id,
                    buyer_id: currentUser.uid,
                    tradingPageId: tradingPageId.crypto.randomUUID()
                };


                const notificationsQuery = query(
                    collection(db, "notifications"),
                    where("productId", "==", productData.id),
                );

                const querySnapshot = await getDocs(notificationsQuery);

                if (querySnapshot.empty) {
                    await addDoc(collection(db, "notifications"), notificationData);
                    console.log("通知を送信しました。");
                } else {
                    console.log("通知は既に存在しています。");
                }
            } catch (error) {
                console.error("通知送信中にエラーが発生しました:", error);
            }
        };

        if (!authLoading) fetchProductData();
    }, [productId, authLoading, user]);

    const handleConfirm = async () => {
        if (!product) return;
        try {

            const purchaseQuery = query(
                collection(db, "purchaseHistory"),
                where("productId", "==", product.id),
                where("buyer_id", "==", currentUser.uid)
            );
            const purchaseSnapshot = await getDocs(purchaseQuery);

            if (!purchaseSnapshot.empty) {
                console.log("This purchase has already been recorded.");
                return;
            }

            const purchaseData = {
                productId: product.id,
                productName: product.name,
                buyerId: currentUser.uid,
                sellerId: product.sellerId,
                purchaseDate: new Date().toISOString(),
            };
            await addDoc(collection(db, "purchaseHistory"), purchaseData);

            const notificationData = {
                message: `商品「${product.name}」が購入されました。`,
                timestamp: new Date().toISOString(),
                read: false,
                productId: product.id,
                seller: product.sellerId,
            };
            await addDoc(collection(db, "notifications"), notificationData);

            const points = Math.floor(product.price * 0.1);
            const userCartRef = doc(db, 'sellers', product.sellerId, 'points', 'allPoint');
            const userCartSnapshot = await getDoc(userCartRef);

            if (userCartSnapshot.exists()) {
                const existingPoints = userCartSnapshot.data().point.points;
                const newPoints = existingPoints + points;

                await updateDoc(userCartRef, {
                    point: { points: newPoints },
                    timestamp: new Date(),
                });
            } else {
                const pointData = { points };
                await setDoc(userCartRef, { point: pointData, timestamp: new Date() });
            }

            const notificationsQuery = query(
                collection(db, 'notifications'),
                where('productId', '==', product.id)
            );
            const notificationsSnapshot = await getDocs(notificationsQuery);

            const deletePromises = notificationsSnapshot.docs.map((docSnapshot) => {
                return deleteDoc(doc(db, 'notifications', docSnapshot.id));
            });

            await Promise.all(deletePromises);

            setIsConfirmed(true);
            console.log("購入履歴と通知が保存され、ポイントが加算されました。");

            const notificationToDeletedQuery = query(
                collection(db, 'notifications'),
                where('productId', '==', product.id),
                where('buyer_id', '==', currentUser.uid)
            );
            const notificationToDeletedSnapshot = await getDocs(notificationToDeletedQuery);

            const deleteNotificationPromises = notificationToDeletedSnapshot.docs.map((docSnapshot) => {
                return deleteDoc(doc(db, 'notifications', docSnapshot.id));
            });
            await Promise.all(deleteNotificationPromises);
            console.log('通知データ消去。');
        } catch (error) {
            console.error("データ保存中にエラーが発生しました:", error);
        }

        setTimeout(() => {
            setIsConfirmed(true);
            router.push('/');
        }, 1000);
    };

    const handleDelete = (productId) => {
        deleteProduct(productId);
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

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                if (user) {
                    const sellersdoc = doc(db, "sellers", product.sellerId);
                    const sellerSnap = await getDoc(sellersdoc);

                    if (sellerSnap.exists()) {
                        const sellerData = { id: sellerSnap.id, ...sellerSnap.data() };
                        setsellername(sellerData.sellerName);
                    } else {
                        console.log("指定されたユーザーがいません");
                    }
                }
            } catch (error) {
                console.error("ユーザーの取得中にエラーが発生しました:", error);
            }
        };
        if (!authLoading) fetchSellers();
    }, [user]);

    return (
        <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
            <BackButtonHome />
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', height: '200px' }}>
                <h1>取引画面</h1>
            </header>

            <div style={{
                backgroundColor: '#ffffe0',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <p><strong>※必須</strong> 発送者・受取側はこちらで詳細を確認ください</p>
                <a href="https://note.com/candy_f_milk/n/ncdbb4e9b98d6" target="_blank" rel="noopener noreferrer">
                    こちらをクリック
                </a>
                <p>また、URLの共有や取引者様とのやり取りなどは下のチャット機能をご利用ください。</p>
            </div>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h2>取引状況: {isConfirmed ? '確認済み' : '未確認'}</h2>
                {product && currentUser?.uid !== product.sellerId && (
                    <button
                        style={{
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '8px'
                        }}
                        onClick={handleConfirm}
                    >
                        確認ボタン
                    </button>
                )}
                {product && (
                    <div style={{ marginTop: '16px' }}>
                        <p><strong>商品名:</strong> {product.name}</p>
                        <p><strong>価格:</strong> ¥{product.price}</p>
                    </div>
                )}

                {!product && <p>商品情報を読み込み中...</p>}

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        color: '#333'
                    }}>チャット</h3>

                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        marginBottom: '16px',
                        padding: '8px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            height: '100px',
                            padding: '8px',
                            marginBottom: '8px',
                            borderRadius: '8px'
                        }}>
                        </div>
                        <div style={{
                            padding: '8px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            alignSelf: 'flex-end'
                        }}>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <SendMessage />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TradePage;