'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useRouter } from 'next/router';
import { getAuth } from "firebase/auth";

const PersonalInfoPage = () => {
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber1, setPhoneNumber1] = useState(''); // 090
    const [phoneNumber2, setPhoneNumber2] = useState(''); // xxxx
    const [phoneNumber3, setPhoneNumber3] = useState(''); // xxxx
    const [birthDate, setBirthDate] = useState('');
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    const [genUid, setGenUid] = useState('');
    const router = useRouter();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchGenUid = async () => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'sellers', currentUser.uid));
                if (userDoc.exists()) {
                    setGenUid(userDoc.data().genUid);
                } else {
                    console.error('ユーザードキュメントが見つかりません');
                }
            }
        };

        fetchGenUid();
    }, [currentUser]);

    const handleAddressChange = (e) => {
        const inputAddress = e.target.value;
        setAddress(inputAddress);
        const addressRegex = /^[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF0-9０-９\-ー\s]+[都道府県市区町村町村郡]+[\u4E00-\u9FAF0-9０-９\-ー\s]+$/;
        setIsAddressValid(addressRegex.test(inputAddress));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = currentUser?.uid || genUid;

        if (!userId) {
            alert('Uidが見つかりませんでした。');
            return;
        }

        // 電話番号の検証
        const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;
        const phoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;

        if (!phoneRegex.test(phoneNumber)) {
            setIsPhoneValid(false);
            return;
        }

        try {
            // Firestoreにデータを追加
            await addDoc(collection(db, 'users'), {
                fullName,
                address,
                phoneNumber,
                birthDate,
                createdAt: serverTimestamp(),
                genId: genUid,
                userId,
            });

            alert('個人情報が保存されました');
            router.push('/');
        } catch (error) {
            console.error('個人情報の保存に失敗しました: ', error);
            alert('保存に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <h2 style={{ textAlign: 'center' }}>個人情報登録</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="fullName">フルネーム:</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="address">住所:</label>
                    <input
                        type="text"
                        id="address"
                        value={address}
                        onChange={handleAddressChange}
                        required
                        className={`form-control ${isAddressValid ? '' : 'is-invalid'}`}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                    {!isAddressValid && (
                        <div className="invalid-feedback" style={{ color: 'red' }}>
                            有効な住所を入力してください。
                        </div>
                    )}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="phoneNumber">電話番号:</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            id="phoneNumber1"
                            value={phoneNumber1}
                            onChange={(e) => setPhoneNumber1(e.target.value)}
                            maxLength="4"
                            required
                            className={`form-control ${isPhoneValid ? '' : 'is-invalid'}`}
                            style={{ width: '30%' }}
                            placeholder="090"
                        />
                        <span>-</span>
                        <input
                            type="text"
                            id="phoneNumber2"
                            value={phoneNumber2}
                            onChange={(e) => setPhoneNumber2(e.target.value)}
                            maxLength="4"
                            required
                            className={`form-control ${isPhoneValid ? '' : 'is-invalid'}`}
                            style={{ width: '30%' }}
                            placeholder="xxxx"
                        />
                        <span>-</span>
                        <input
                            type="text"
                            id="phoneNumber3"
                            value={phoneNumber3}
                            onChange={(e) => setPhoneNumber3(e.target.value)}
                            maxLength="4"
                            required
                            className={`form-control ${isPhoneValid ? '' : 'is-invalid'}`}
                            style={{ width: '30%' }}
                            placeholder="xxxx"
                        />
                    </div>
                    {!isPhoneValid && (
                        <div className="invalid-feedback" style={{ color: 'red' }}>
                            有効な電話番号を入力してください（例: 090-xxxx-xxxx）。
                        </div>
                    )}
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                    <label htmlFor="birthDate">生年月日:</label>
                    <input
                        type="date"
                        id="birthDate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                        className="form-control"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        max={new Date().toISOString().split("T")[0]}
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

export default PersonalInfoPage;