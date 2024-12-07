import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import BackButton from "@/pages/backbutton";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const router = useRouter();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router]);


    useEffect(() => {
        const fetchProducts = async () => {
            if (user) {
                const q = query(
                    collection(db, "products"),
                    where("sellerId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const productList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProducts(productList);
            }
        };
        fetchProducts();
    }, [user]);

    return (
        <div style={styles.container}>
            <BackButton/>
            <h1 style={styles.title}>出品リスト</h1>
            <ul style={styles.productList}>
                {products.map((product) => (
                    <li key={product.id} style={styles.productCard}>
                        <img
                            src={product.imageUrls[0] || "/placeholder.jpg"}
                            alt={product.name}
                            style={styles.productImage}
                        />
                        <div style={styles.productInfo}>
                            <p style={styles.productName}>商品名: {product.name}</p>
                            <p style={styles.productPrice}>価格: ¥{product.price}</p>
                            <button
                                style={styles.editButton}
                                onClick={() =>
                                    router.push(`/listing-history/producteditpage/${product.id}`)
                                }
                            >
                                出品編集
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
    },
    backButton: {
        position: "absolute",
        top: "20px",
        left: "20px",
        padding: "8px 12px",
        fontSize: "14px",
        color: "#555",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    productList: {
        listStyle: "none",
        padding: "0",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
    },
    productCard: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    productImage: {
        width: "120px",
        height: "120px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "10px",
    },
    productInfo: {
        textAlign: "center",
    },
    productName: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    productPrice: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "10px",
    },
    editButton: {
        padding: "8px 16px",
        fontSize: "14px",
        color: "#fff",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default ProductsPage;
