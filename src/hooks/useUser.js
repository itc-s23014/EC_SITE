/**
 * 現在ログインしているユーザーを取得するカスタムフック。
 *
 * @returns {Object|null} 現在のユーザー情報（ログインしていない場合はnull）。
 */

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return user;
};

export default useUser;
