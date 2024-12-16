import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import BackButton from "../../components/BackButton/BackButton";

const PurchaseHistory = () => {
    const [purchasedProducts, setPurchasedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchPurchasedProducts(currentUser.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchPurchasedProducts = async (uid) => {
        try {
            // 購入履歴のコレクションを取得
            const purchasesCollection = collection(db, "purchases");
            const q = query(purchasesCollection, where("userId", "==", uid));
            const purchasesSnapshot = await getDocs(q);

            // 購入した商品のIDを取得
            const purchasedProductIds = purchasesSnapshot.docs.map((doc) => doc.data().productId);

            if (purchasedProductIds.length > 0) {
                // 購入した商品を取得
                const productsCollection = collection(db, "products");
                const productsSnapshot = await getDocs(productsCollection);

                const filteredProducts = productsSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((product) => purchasedProductIds.includes(product.id));

                setPurchasedProducts(filteredProducts);
            } else {
                setPurchasedProducts([]);
            }
        } catch (error) {
            console.error("fetching purchased products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>ログインしてください。</p>;
    }

    return (
        <div style={styles.container}>
            <BackButton/>
            <header style={styles.header}>
                <h1 style={styles.title}>購入履歴</h1>
                <h2 style={styles.subtitle}>あなたが購入した商品</h2>
            </header>

            <div style={styles.gridContainer}>
                {purchasedProducts.length > 0 ? (
                    purchasedProducts.map((product) => (
                        <Link key={product.id} href={`/Catalog/detail/${product.id}`} passHref>
                            <div style={styles.card}>
                                <img
                                    src={
                                        product.imageUrls && product.imageUrls.length > 0
                                            ? product.imageUrls[0]
                                            : "/placeholder.jpg"
                                    }
                                    alt={product.name}
                                    style={styles.productImage}
                                />
                                <div style={styles.productInfo}>
                                    <h2 style={styles.productName}>{product.name}</h2>
                                    <p style={styles.productPrice}>¥{product.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p style={styles.noItemsMessage}>購入履歴がありません。</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        padding: "8px 12px",
        fontSize: "14px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    header: {
        textAlign: "center",
        marginBottom: "40px",
    },
    title: {
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    subtitle: {
        fontSize: "24px",
        color: "#555",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
    },
    card: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#fff",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    productImage: {
        width: "auto", // 自動幅調整
        height: "150px", // 高さ固定
        maxWidth: "100%", // カード内での画像の最大幅を制限
        objectFit: "cover", // 画像の比率を保ちながらカードにフィット
        borderBottom: "1px solid #ddd",
        display: "block", // 中央寄せのため
        margin: "0 auto",
    },

    productInfo: {
        padding: "16px",
        textAlign: "center",
    },
    productName: {
        fontSize: "18px",
        fontWeight: "bold",
        margin: "0 0 8px",
    },
    productPrice: {
        fontSize: "16px",
        color: "#666",
    },
    noItemsMessage: {
        textAlign: "center",
        color: "#777",
        fontSize: "16px",
    },
};

export default PurchaseHistory;