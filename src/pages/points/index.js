import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';


const Points = () => {
    const [points, setPoints] = useState(null);
    const [sellerName, setSellerName] = useState("");
    const auth = getAuth();
    const uid = auth.currentUser ? auth.currentUser.uid : null;
  const router = useRouter();
  const { user: authUser, loading: authloading } = useAuthGuard();

    const convertPoints = () => {
        alert("ポイント現金化の処理を開始します。");
    };

    const setAccount = () => {
        alert("口座設定ページに移動します。");
    };

    useEffect(() => {
        if (!uid) return;

        const userCartRef = doc(db, "sellers", uid, "points", "allPoint");

        const unsubscribe = onSnapshot(userCartRef, (docSnapshot) => {
            console.log(docSnapshot.data());
            if (docSnapshot.exists()) {
                const data = docSnapshot.data().point.points;
                setPoints(data);
            } else {
                setPoints(0);
            }
        });

        return () => unsubscribe();
    }, [uid]);


  if (authloading) {
    return <LoadingComponent />
  }

  return (
    <div className="container">

    {/* セクション1 */}
    <div className=" w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
    <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
    <div className="sticky flex flex-col gap-3 p-5 text-sm border-r border-indigo-100 top-12">
    <h2 className="pl-3 mb-5 text-2xl font-bold text-gray-900">設定</h2>
    <button
      onClick={() => router.push("/personal-information")}
      className="flex items-center px-4 py-3 text-gray-700 font-medium border border-transparent rounded-lg transition-all duration-200 hover:text-indigo-900 hover:border-gray-300"
    >
      アカウント設定
    </button>
    <button
      onClick={() => router.push("/purchase-history")}
      className="flex items-center px-4 py-3 text-gray-700 font-medium border border-transparent rounded-lg transition-all duration-200 hover:text-indigo-900 hover:border-gray-300"
    >
      購入履歴
    </button>
    <button
      onClick={() => router.push("/listing-history")}
      className="flex items-center px-4 py-3 text-gray-700 font-medium border border-transparent rounded-lg transition-all duration-200 hover:text-indigo-900 hover:border-gray-300"
    >
      出品中の商品
    </button>
    <button
      onClick={() => router.push("/points")}
      className="flex items-center px-4 py-3 font-bold border border-gray-400 rounded-lg transition-all duration-200"
    >
      ポイント残高
    </button>
    </div>
    </aside>


    {/* セクション2 */}
    <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
    <div className="p-2 md:p-4">
    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
      <h2 className="pl-6 text-2xl font-bold sm:text-xl">ポイント残高</h2>
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
    {sellerName && <div className="text-lg font-semibold mb-2">{sellerName} さん</div>}
    <div className="text-gray-700 mb-4">
        ポイント残高: <span className="font-bold">{points !== null ? points : "読み込み中..."}</span> ポイント
    </div>
    <div className="flex space-x-4">
        <button
            onClick={convertPoints}
            className="px-4 py-2 border border-black text-black bg-white rounded-lg hover:bg-gray-900 hover:text-white transition"
        >
            ポイント現金化
        </button>
        <button
            onClick={setAccount}
            className="px-4 py-2 border border-black text-white bg-black rounded-lg hover:bg-gray-800 transition"
        >
            口座設定
        </button>
    </div>
</div>

    </div>
    </div>
    </main>
    </div>

    <style jsx>{`
    .container {
      font-family: Arial, sans-serif;
      margin: 0 auto;
      padding: 0 10px;
    }
    `}</style>
    </div>
  );
}

export default Points;