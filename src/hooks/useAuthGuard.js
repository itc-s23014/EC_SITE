/**
 * ユーザーの認証状態を監視し、ログインしていない場合はログインページにリダイレクトするカスタムフック。
 *
 * ユーザーがログインしている場合はそのユーザー情報を返し、ログインしていない場合は `/login` ページにリダイレクトします。
 * 初期状態では読み込み中フラグ (`loading`) を `true` に設定し、認証状態が確認できた時点で `false` に更新します。
 *
 * @returns {Object} - ユーザー情報と読み込み状態を含むオブジェクト。
 *  - `user` {Object|null} - 認証されたユーザーオブジェクト。ログインしていない場合は `null`。
 *  - `loading` {boolean} - 認証状態のチェックが完了するまで `true`。完了後は `false`。
 *
 */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useAuthGuard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.replace("/login"); // 未ログインの場合はログインページにリダイレクト
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  return { user, loading };
};


export default useAuthGuard;