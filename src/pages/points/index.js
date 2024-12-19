import { useEffect, useState } from "react";
import BackButton from "@/components/BackButton/BackButton";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";

export default function Home() {
    const [points, setPoints] = useState(null);
    const [sellerName, setSellerName] = useState("");
    const auth = getAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : null;

    const convertPoints = () => {
        alert("ポイント現金化の処理を開始します。");
    };

    const setAccount = () => {
        alert("口座設定ページに移動します。");
    };

    useEffect(() => {
        if (!uid) return;


        const userCartRef = doc(db, "sellers", uid, "points", "allPoint");

        const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
            console.log(docSnapshot.data());
            if (docSnapshot.exists()) {
                const data = docSnapshot.data().point.points;
                setPoints(data);

            } else {
                setPoints(0);
            }
        });


        return () => unsubscribe();
    }, [uid]);

    return (
        <div style={styles.container}>
            <BackButton />
            <div style={styles.balance}>
                {sellerName && <div>{sellerName}さん</div>}
                ポイント残高: <span>{points !== null ? points : "読み込み中..."}</span> ポイント
            </div>
            <div style={styles.buttons}>
                <button style={styles.button} onClick={convertPoints}>
                    ポイント現金化
                </button>
                <button style={styles.button} onClick={setAccount}>
                    口座設定
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f0f0f0",
    },
    balance: {
        fontSize: "3em",
        fontWeight: "bold",
        color: "#2c3e50",
    },
    buttons: {
        marginTop: "20px",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "15px 30px",
        margin: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "1.2em",
        transition: "background-color 0.3s",
    },
};
