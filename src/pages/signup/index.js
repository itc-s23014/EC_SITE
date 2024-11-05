'use client';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import app from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);

const AddUserPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sellerName, setSellerName] = useState(''); // sellerNameのステートを追加
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;


            await addDoc(collection(db, 'sellers'), {
                sellerId: user.uid,
                sellerName,
                createdAt: new Date(),
            });

            console.log('ユーザーが登録され、sellerIdとsellerNameが保存されました');
            router.push('/Private_information');
        } catch (error) {
            console.log('登録に失敗しました: ', error);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center' }}>ユーザー登録</h2>
            <form onSubmit={handleRegister}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">メールアドレス:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">パスワード:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="sellerName">出品者名:</label>
                    <input
                        type="text"
                        id="sellerName"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button
                    type="submit"
                    className="btn"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    登録
                </button>
            </form>
        </div>
    );
};

export default AddUserPage;
