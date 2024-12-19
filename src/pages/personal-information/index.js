import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import BackButton from "@/components/BackButton/BackButton";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useSellerAndUserData } from "@/hooks/useSellerAndUserData";

const EditProfile = () => {
    const router = useRouter();
    const { user, loading: authloading } = useAuthGuard(); //認証を強制
    const { userData, loading, error } = useSellerAndUserData(user?.uid);

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        birthDate: "",
    });

    const { fullName, phoneNumber, address, birthDate } = formData;

    useEffect(() => {
        if (userData) {
            setFormData({
                fullName: userData.fullName || "",
                phoneNumber: userData.phoneNumber || "",
                address: userData.address || "",
                birthDate: userData.birthDate || "",
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (userDocId) {
                const userDocRef = doc(db, "users", userDocId);
                await updateDoc(userDocRef, {
                    fullName,
                    phoneNumber,
                    address,
                    birthDate,
                });
                alert("Profile updated successfully.");
                router.push("/profile");
            } else {
                alert("ユーザーデータが見つかりません。");
            }
        } catch (err) {
            console.error(err);
            alert("Error updating profile.");
        }
    };

    if (authloading) {
        return <LoadingComponent />
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <BackButton/>
            <h1 style={styles.title}>プロフィール編集</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label>
                    名前
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                </label>

                <label>
                    電話番号
                    <input
                        type="text"
                        name="phoneNumber"
                        value={phoneNumber}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                </label>

                <label>
                    住所
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={handleInputChange}
                        style={styles.input}
                    />
                </label>

                <label>
                    生年月日
                    <input
                        type="date"
                        name="birthDate"
                        value={birthDate}
                        onChange={handleInputChange}
                        style={styles.input}
                        max={new Date().toISOString().split("T")[0]}
                    />
                </label>

                <button type="submit" style={styles.submitButton}>
                    保存
                </button>
            </form>
        </div>
    );
};
const styles = {
    container: {
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
    },
    backButton: {
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        padding: "10px 16px",
        fontSize: "16px",
        borderRadius: "4px",
        cursor: "pointer",
        marginBottom: "20px",
    },
    title: {
        fontSize: "42px",
        fontWeight: "bold",
        marginBottom: "30px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "400px",
        margin: "0 auto",
    },
    input: {
        padding: "12px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "6px",
    },
    submitButton: {
        backgroundColor: "#007BFF",
        color: "#fff",
        padding: "12px 24px",
        fontSize: "18px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
};


export default EditProfile;
