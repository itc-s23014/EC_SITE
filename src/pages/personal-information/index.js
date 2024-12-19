import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
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
        phoneNumber1: "",
        phoneNumber2: "",
        phoneNumber3: "",
        address: "",
        birthDate: "",
    });

    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true); // 住所の検証結果を管理

    const { fullName, phoneNumber1, phoneNumber2, phoneNumber3, address, birthDate } = formData;

    useEffect(() => {
        if (userData) {
            const [phone1 = "", phone2 = "", phone3 = ""] = (userData.phoneNumber || "").split("-");
            setFormData({
                fullName: userData.fullName || "",
                phoneNumber1: phone1,
                phoneNumber2: phone2,
                phoneNumber3: phone3,
                address: userData.address || "",
                birthDate: userData.birthDate || "",
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // フォームデータの更新
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // 住所の場合は追加のバリデーションを行う
        if (name === "address") {
            const addressRegex = /^[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF0-9０-９\-ー\s]+[都道府県市区町村町村郡]+[\u4E00-\u9FAF0-9０-９\-ー\s]+$/;
            setIsAddressValid(addressRegex.test(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 電話番号の検証
        const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;
        const phoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;

        // 日本の住所検証
        const addressRegex = /^[ァ-ヶ一-龯々〆〤0-9a-zA-Z\s、，・\-]+$/;

        // 電話番号と住所の検証
        if (!phoneRegex.test(phoneNumber)) {
            setIsPhoneValid(false);
            return;
        } else {
            setIsPhoneValid(true); // 電話番号が有効な場合は有効と設定
        }

        if (!addressRegex.test(address)) {
            setIsAddressValid(false); // 住所が無効な場合はエラーを表示
            return;
        } else {
            setIsAddressValid(true); // 住所が有効な場合は有効と設定
        }

        try {
            if (userData?.id) {
                const userDocRef = doc(db, "users", userData.id);
                await updateDoc(userDocRef, {
                    fullName,
                    phoneNumber,
                    address,
                    birthDate,
                });
                alert("プロフィールが更新されました。");
                router.push("/profile");
            } else {
                alert("ユーザーデータが見つかりません。");
            }
        } catch (err) {
            console.error(err);
            alert("プロフィールの更新中にエラーが発生しました。");
        }
    };

    if (authloading || loading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div style={styles.container}>
            <BackButton />
            <h1 style={styles.title}>プロフィール編集</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div className="form-group">
                    <label>名前</label>
                    <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div className="form-group">
                    <label>電話番号</label>
                    <div style={styles.phoneContainer}>
                        <input
                            type="text"
                            name="phoneNumber1"
                            value={phoneNumber1}
                            onChange={handleChange}
                            maxLength="4"
                            required
                            style={styles.phoneInput}
                            placeholder="090"
                        />
                        <span>-</span>
                        <input
                            type="text"
                            name="phoneNumber2"
                            value={phoneNumber2}
                            onChange={handleChange}
                            maxLength="4"
                            required
                            style={styles.phoneInput}
                            placeholder="xxxx"
                        />
                        <span>-</span>
                        <input
                            type="text"
                            name="phoneNumber3"
                            value={phoneNumber3}
                            onChange={handleChange}
                            maxLength="4"
                            required
                            style={styles.phoneInput}
                            placeholder="xxxx"
                        />
                    </div>
                    {!isPhoneValid && (
                        <div style={styles.errorMessage}>
                            有効な電話番号を入力してください（例: 090-xxxx-xxxx）。
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>住所</label>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    {!isAddressValid && (
                        <div style={styles.errorMessage}>
                            有効な住所を入力してください（例: 東京都渋谷区渋谷1丁目）。
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>生年月日</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={birthDate}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
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
        maxWidth: "400px",
        margin: "0 auto",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    input: {
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "100%",
    },
    phoneContainer: {
        display: "flex",
        gap: "5px",
        alignItems: "center",
    },
    phoneInput: {
        padding: "8px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        width: "30%",
    },
    errorMessage: {
        color: "red",
        fontSize: "12px",
        marginTop: "5px",
    },
    submitButton: {
        backgroundColor: "#007BFF",
        color: "#fff",
        padding: "10px",
        fontSize: "16px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default EditProfile;
