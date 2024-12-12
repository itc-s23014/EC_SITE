import { useShoppingCart } from "use-shopping-cart";
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import BackButton from "@/components/BackButton/BackButton";
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingComponent from '@/components/LoadingComponent';

const LikeList = () => {
    const [likedProducts, setLikedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const { user: authUser, loading: authloading } = useAuthGuard(); //認証を強制

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchLikedProducts(currentUser.uid);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchLikedProducts = async (uid) => {
        try {
            const likesCollection = collection(db, "likes");
            const q = query(likesCollection, where("userId", "==", uid));
            const likesSnapshot = await getDocs(q);

            const likedProductIds = likesSnapshot.docs.map((doc) => doc.data().productId);

            if (likedProductIds.length > 0) {
                const productsCollection = collection(db, "products");
                const productsSnapshot = await getDocs(productsCollection);

                const filteredProducts = productsSnapshot.docs
                    .map((doc) => ({ id: doc.id, ...doc.data() }))
                    .filter((product) => likedProductIds.includes(product.id));

                setLikedProducts(filteredProducts);
            } else {
                setLikedProducts([]);
            }
        } catch (error) {
            console.error("Error fetching liked products:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingComponent />
    }

    if (!user) {
        return <p style={{ textAlign: "center", marginTop: "20px" }}>ログインしてください。</p>;
    }

    return (
        <div style={styles.container}>
            <BackButton/>
            <header style={styles.header}>
                <h1 style={styles.title}>Like List</h1>
                <h2 style={styles.subtitle}>あなたが「いいね」した商品</h2>
            </header>

            <div style={styles.gridContainer}>
                {likedProducts.length > 0 ? (
                    likedProducts.map((product) => (
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
                    <p style={styles.noItemsMessage}>「いいね」した商品がありません。</p>
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
        width: "auto",
        height: "150px",
        maxWidth: "100%",
        objectFit: "cover",
        borderBottom: "1px solid #ddd",
        display: "block",
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

export default LikeList;