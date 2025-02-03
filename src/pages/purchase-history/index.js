import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { usePurchaseHistory } from "@/hooks/usePurchaseHistory";
import useUser from "@/hooks/useUser";

const  UserDashboard =() => {
    const router = useRouter();
    const auth = getAuth();
    const { user: authuser, loading: authloading } = useAuthGuard();
    const { purchasedProducts, loading: purchaseHistoryLoading } = usePurchaseHistory();
    const user = useUser();
    const [purchasedProduct,setpurchaseProducts] = useState([])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = auth.currentUser.uid
                console.log('uid',uid)
                // usersコレクションからUIDでデータを取得
                const userQuery = query(collection(db, "users"), where("userId", "==", uid));
                const userSnapshot = await getDocs(userQuery);

                // sellersコレクションからUIDでデータを取得
                const sellerDoc = doc(db, "sellers", uid);
                const sellerSnapshot = await getDoc(sellerDoc);

                if (sellerSnapshot.exists()) {
                    const sellerData = sellerSnapshot.data();
                    setSellerName(sellerData.sellerName);
                } else {
                    console.error("セラーデータが見つかりませんでした");
                }

                if (!userSnapshot.empty) {
                    const userDoc = userSnapshot.docs[0];
                    setUserData({ id: userDoc.id, ...userDoc.data() });
                } else {
                    console.error("ユーザーデータが見つかりませんでした");
                }
            } catch (error) {
                console.error("ユーザーデータの取得中にエラーが発生しました", error);
            } finally {
            }
            const purchaseHistorycollection = collection(db, 'purchaseHistory');
            const q = query(purchaseHistorycollection, where("buyerId", "==", auth.currentUser.uid));
            console.log(auth.currentUser.uid)
            const purchaseHistorySnapshot = await getDocs(q);
            const purchaseHistoryList = purchaseHistorySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setpurchaseProducts(purchaseHistoryList)

        };


        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
            } else {
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, router]);


    if (authloading || purchaseHistoryLoading) {
        return <LoadingComponent />
    }

    return (
        <div className="container">
            <Header />

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
                            className="flex items-center px-4 py-3 font-bold border border-gray-400 rounded-lg transition-all duration-200"
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
                            className="flex items-center px-4 py-3 text-gray-700 font-medium border border-transparent rounded-lg transition-all duration-200 hover:text-indigo-900 hover:border-gray-300"
                        >
                            ポイント残高
                        </button>
                    </div>
                </aside>


                {/* セクション2 */}
                <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
                    <div className="p-2 md:p-4">
                        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                            <h2 className="pl-6 text-2xl font-bold sm:text-xl">アカウント設定</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {purchasedProduct.length > 0 ? (
                                    purchasedProduct.map((product) => (
                                        <Link key={product.productId} href={``} passHref>
                                            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                                                <Image
                                                    src={
                                                        product.img && product.img.length > 0
                                                            ? product.img[0]
                                                            : "/placeholder.jpg"
                                                    }
                                                    alt={product.productName}
                                                    width={500}
                                                    height={500}
                                                    className="w-full h-48 object-cover mb-4 rounded"
                                                />
                                                <div className="text-center">
                                                    <h2 className="text-xl font-bold mb-2">{product.productName}</h2>
                                                    <p className="text-lg text-gray-700">¥{product.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-600 mt-6">
                                        <p>まだ何も購入していません。</p>
                                    </div>
                                )}
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
export default UserDashboard;