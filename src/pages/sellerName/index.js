'use client'
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const SellerNamePage = () => {
    const [sellerName, setSellerName] = useState('');
    const router = useRouter();
    const { user, loading: authloading } = useAuthGuard(); //認証を強制

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await addDoc(collection(db, 'sellers'), {
                sellerName,
                createdAt: serverTimestamp()
            });
            alert('出品者名が保存されました');
            router.push('/');
        } catch (error) {
            console.error('出品者名の保存に失敗しました: ', error);
            alert('保存に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center' }}>ユーザー名登録</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="sellerName">ユーザーネーム:</label>
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

export default SellerNamePage;
