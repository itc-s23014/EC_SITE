import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import BackButton from "@/components/BackButton/BackButton";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userDocId, setUserDocId] = useState(null);
    const router = useRouter();
    const { user, loading: authloading } = useAuthGuard(); //認証を強制

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        address: "",
        birthDate: "",
    });

    const { fullName, phoneNumber, address, birthDate } = formData;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const sellerDocRef = doc(db, "sellers", user.uid);
                    const sellerDocSnap = await getDoc(sellerDocRef);

                    if (sellerDocSnap.exists()) {
                        const sellerData = sellerDocSnap.data();
                        const sellerGenUid = sellerData.genUid;


                        const usersQuery = query(collection(db, "users"), where("genId", "==", sellerGenUid));
                        const usersQuerySnap = await getDocs(usersQuery);

                        if (!usersQuerySnap.empty) {
                            const matchedUserDoc = usersQuerySnap.docs[0];
                            const matchedUser = matchedUserDoc.data();

                            setUserDocId(matchedUserDoc.id);
                            setUserData(matchedUser);
                            setFormData({
                                fullName: matchedUser.fullName,
                                phoneNumber: matchedUser.phoneNumber,
                                address: matchedUser.address,
                                birthDate: matchedUser.birthDate,
                            });
                        } else {
                            setError("一致するユーザーが見つかりませんでした。");
                        }
                    } else {
                        setError("Seller not found.");
                    }
                } else {
                    setError("User not logged in.");
                }
            } catch (err) {
                console.error(err);
                setError("Error fetching data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

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

    if (isLoading) {
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
