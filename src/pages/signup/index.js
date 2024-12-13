'use client';
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db } from '../../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { generateUID } from '@/utils/uidGenerator'; // UID生成関数をインポート
import app from '../../../firebaseConfig'; // Firebase appのインポート
import BackButton from '@/components/BackButton/BackButton';

const auth = getAuth(app);

const AddUserPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [genUid, setGenUid] = useState('');  // genUidをuseStateで管理
    const router = useRouter();

    // useEffectでUIDを生成
    useEffect(() => {
        setGenUid(generateUID());
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // メールアドレスとパスワードでユーザー登録
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firestoreにユーザー情報を保存
            await setDoc(doc(db, 'sellers', user.uid), {
                sellerName,
                createdAt: new Date(),
                genUid: genUid,  // genUidを保存
                email: email,
                password: password,  // 必要であれば保存
            });

            console.log('ユーザーが登録され、sellerIdとsellerNameが保存されました');
            router.push({
                pathname: '/Private_information',
                query: { genUid: genUid },  // genUidをクエリパラメータとして渡す
            });
        } catch (error) {
            console.log('登録に失敗しました: ', error);
        }
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <BackButton destination="/Catalog"/>
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
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button
                    type="button"
                    onClick={handleLoginRedirect}
                    className="btn"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    ログイン
                </button>
            </div>
        </div>
    );
};

export default AddUserPage;
