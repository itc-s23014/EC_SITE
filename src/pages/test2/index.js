import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState("");
  const router = useRouter();
  const auth = getAuth();
  const { user, loading: authloading } = useAuthGuard();

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
        setLoading(false);
      }
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

  const handleNavigation = (url) => {
    router.push(url);
  };

  if (loading) {
    return <LoadingComponent />
  }

  return (
      <div className="container">
        <Header title={sellerName || "ダッシュボード"} />

        {/* セクション1 */}
        <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">設定</h2>
          <a href="#" className="flex items-center px-3 py-2.5 font-bold bg-white text-indigo-900 border rounded-full">
            アカウント設定
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            購入履歴
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            出品中の商品
          </a>
          <a href="#" className="flex items-center px-3 py-2.5 font-semibold hover:text-indigo-900 hover:border hover:rounded-full">
            ポイント残高
          </a>
        </div>
      </aside>

      {/* セクション2 */}
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
                  alt="Bordered avatar"
                />
                <div className="flex flex-col space-y-5 sm:ml-8">
                  <button
                    type="button"
                    className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:ring-4 focus:ring-indigo-200"
                  >
                    Change picture
                  </button>
                  <button
                    type="button"
                    className="py-3.5 px-7 text-base font-medium text-indigo-900 bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:ring-4 focus:ring-indigo-200"
                  >
                    Delete picture
                  </button>
                </div>
              </div>
              <div className="items-center mt-8 text-[#202142]">
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:mb-6">
                  <div className="w-full">
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900">
                      Your first name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Your first name"
                      value="John"
                      required
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-indigo-900">
                      Your last name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      placeholder="Your last name"
                      value="Ferguson"
                      required
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="your.email@mail.com"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="profession" className="block mb-2 text-sm font-medium text-indigo-900">
                    Profession
                  </label>
                  <input
                    type="text"
                    id="profession"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                    placeholder="your profession"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-indigo-900">
                    Bio
                  </label>
                  <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-indigo-900 bg-indigo-50 rounded-lg border border-indigo-300 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Write your bio here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                  >
                    Save
                  </button>
                </div>
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
          background-color: #f9f9f9;
        }
        header {
          text-align: center;
          margin-bottom: 20px;
        }
        .section {
          margin-top: 10px;
          background-color: #fff;
          border-top: 1px solid #ccc;
          border-bottom: 1px solid #ccc;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 15px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
        }
        li:last-child {
          border-bottom: none;
        }
        a {
          text-decoration: none;
          color: #333;
          font-size: 18px;
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        li:hover {
          background-color: #e0f7fa;
        }
        .arrow {
          color: #666;
          font-size: 16px;
        }
      `}</style>
      </div>
  );
}
