'use client';

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../../../firebaseConfig';
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Header from '@/components/Header';

const auth = getAuth(app);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { user, loading } = useAuthGuard();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
            console.log('ok');
        } catch (error) {
            console.log('error');
        }
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (user) {
        router.push('/');
    } else {
        return (
            <>
            <Header />
            <section className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            ログイン
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
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
                            <button type="submit" className="w-full text-white bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                ログイン
                            </button>
                            <p className="text-sm font-light text-gray-500">
                                アカウントをお持ちではありませんか？
                                <button onClick={handleSignUp} className="font-medium text-primary-600 hover:underline ml-1">
                                    新規登録
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
            </section>
            </>
        );
    }
};

export default LoginPage;
