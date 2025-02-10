'use client';
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { db,app } from '../../../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { generateUID } from '@/utils/uidGenerator'; // UID生成関数をインポート
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
        <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        アカウント作成
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                メールアドレス
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                パスワード
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label htmlFor="sellerName" className="block mb-2 text-sm font-medium text-gray-900">
                                ユーザー名
                            </label>
                            <input
                                type="text"
                                id="sellerName"
                                value={sellerName}
                                onChange={(e) => setSellerName(e.target.value)}
                                required
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            />
                        </div>
                        <button type="submit" className="w-full text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            アカウントを作成
                        </button>
                        <p className="text-sm font-light text-gray-500">
                            すでにアカウントを持っていますか？
                            <button onClick={handleLoginRedirect} className="font-medium text-primary-600 hover:underline ml-1">
                                ログイン
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default AddUserPage;
