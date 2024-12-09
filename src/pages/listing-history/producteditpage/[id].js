import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebaseConfig";
import BackButton from "@/pages/backbutton";

const ProductEditPage = () => {
    const router = useRouter();
    const { id } = router.query; // 商品IDを取得
    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        detail: "",
        imageUrls: [],
    });
    const [newImage, setNewImage] = useState(null);


    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                    setFormData({
                        name: docSnap.data().name || "",
                        price: docSnap.data().price || "",
                        detail: docSnap.data().detail || "",
                        imageUrls: docSnap.data().imageUrls || [],
                    });
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchProduct();
    }, [id]);


    const uploadImage = async (file) => {
        const storageRef = ref(storage, `products/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedImageUrls = [...formData.imageUrls];
            if (newImage) {
                const imageUrl = await uploadImage(newImage);
                updatedImageUrls.push(imageUrl);
            }

            const docRef = doc(db, "products", id);
            await updateDoc(docRef, {
                ...formData,
                imageUrls: updatedImageUrls,
            });

            alert("商品情報を更新しました！");
            router.push("/Catalog");
        } catch (error) {
            console.error("エラー:", error);
            alert("更新に失敗しました。");
        }
    };

    if (!product) return <p style={{ textAlign: "center", fontSize: "18px" }}>Loading...</p>;

    return (
        <div style={styles.container}>
                <BackButton/>
                <h1 style={styles.title}>出品編集</h1>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>商品名</label>
                        <input
                            type="text"
                            style={styles.input}
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>価格</label>
                        <input
                            type="number"
                            style={styles.input}
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>詳細</label>
                        <textarea
                            style={{...styles.input, height: "80px", resize: "none"}}
                            value={formData.detail}
                            onChange={(e) => setFormData({...formData, detail: e.target.value})}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>現在の画像</label>
                        <ul style={styles.imageList}>
                            {formData.imageUrls.map((url, index) => (
                                <li key={index} style={styles.imageListItem}>
                                    <img src={url} alt="商品画像" style={styles.image}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>新しい画像を選択</label>
                        <input type="file" onChange={(e) => setNewImage(e.target.files[0])}/>
                    </div>
                    <button type="submit" style={styles.submitButton}>更新</button>
                </form>
            </div>
            );
            };

            const styles = {
            container: {
            maxWidth: "600px",
            margin: "50px auto",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            backgroundColor: "#fff",
        },
            backButton: {
            display: "block",
            marginBottom: "20px",
            fontSize: "16px",
            color: "#555",
            textDecoration: "none",
        },
            title: {
            textAlign: "center",
            fontSize: "24px",
            marginBottom: "30px",
        },
            form: {
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        },
            formGroup: {
            display: "flex",
            flexDirection: "column",
        },
            label: {
            fontSize: "16px",
            marginBottom: "5px",
        },
            input: {
            padding: "10px",
            fontSize: "16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
        },
            imageList: {
            display: "flex",
            gap: "10px",
            padding: "0",
            listStyle: "none",
            margin: "0",
        },
            imageListItem: {
            flex: "0 0 auto",
        },
            image: {
            width: "100px",
            borderRadius: "4px",
        },
            submitButton: {
            padding: "10px 20px",
            fontSize: "18px",
            color: "#fff",
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
        },
        };

            export default ProductEditPage;
