import { useState } from "react";
import { db, auth } from "../../../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ productId }) => {
    const [message, setMessage] = useState('');
    const user = auth.currentUser;

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!user) {
            console.log("ユーザーが認証されていません。");
            return;
        }

        if (!message.trim()) {
            console.log("メッセージを入力してください。");
            return;
        }

        const { uid, photoURL, displayName } = user;

        try {
            // Firestore の "messages" コレクションに新しいメッセージを追加
            await addDoc(collection(db, "messages"), {
                text: message.trim(),
                uid,
                photoURL,
                displayName,
                productId,
                createdAt: serverTimestamp(),
            });

            // メッセージ入力欄をクリア
            setMessage('');
        } catch (error) {
            console.error("メッセージ送信中にエラーが発生しました:", error);
        }
    };

    return (
        <div className="send-message-container">
            <form onSubmit={sendMessage} className="send-message-form">
                <input
                    type="text"
                    placeholder="メッセージを入力してください"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="message-input"
                />
                <button type="submit" className="send-button">
                    送信
                </button>
            </form>
        </div>
    );
};

export default SendMessage;
