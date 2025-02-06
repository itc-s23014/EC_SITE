'use client';

import { useState } from "react";
import { useEffect } from "react";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../../../firebaseConfig';
import { useRouter } from "next/navigation";
import {useAuthGuard} from "@/hooks/useAuthGuard"
import BackButton from "@/components/BackButton/BackButton";

const auth = getAuth(app);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const {user, loading} = useAuthGuard();

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

    if(loading) {
        return <p>Laoding...</p>
    }
    if (user) {
        router.push('/');
    } else {
            return (
        <div className="container" style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '50px' }}>
            <BackButton destination="/"/>
            <h2 style={{ textAlign: 'center' }}>ログイン</h2>
            <form onSubmit={handleLogin}>
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
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    ログイン
                </button>
                <button
                    type="button"
                    onClick={handleSignUp}
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
                    新規登録
                </button>
            </form>
        </div>
    );
    }

};

export default LoginPage;
