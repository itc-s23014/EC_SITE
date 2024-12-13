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

        const {uid, photoURL, displayName} = user;

        try {
            await addDoc(collection(db, "messages"), {
                text: message.trim(),
                uid,
                photoURL,
                displayName,
                productId,
                createdAt: serverTimestamp(),
            });


            setMessage('');
        } catch (error) {
            console.error("メッセージ送信中にエラーが発生しました:", error);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#f9f9f9',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <form
                onSubmit={sendMessage}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '600px',
                    gap: '12px'
                }}
            >
                <input
                    type="text"
                    placeholder="メッセージを入力してください"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'border-color 0.3s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#4CAF50')}
                    onBlur={(e) => (e.target.style.borderColor = '#ddd')}
                />
                <button
                    type="submit"
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#45a049')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#4CAF50')}
                >
                    送信
                </button>
            </form>
        </div>
    );
}

export default SendMessage;
