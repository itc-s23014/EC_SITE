import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header/Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useSellerAndUserData } from "@/hooks/useSellerAndUserData";

export default function UserDashboard() {
  const [sellerName, setSellerName] = useState("");
  const router = useRouter();
  const auth = getAuth();
  const { user, loading: authloading } = useAuthGuard();
  const { userData, loading, error } = useSellerAndUserData(user?.uid);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber1: "",
    phoneNumber2: "",
    phoneNumber3: "",
    address: "",
    birthDate: "",
});

const [isPhoneValid, setIsPhoneValid] = useState(true);
const [isAddressValid, setIsAddressValid] = useState(true);

const { fullName, phoneNumber1, phoneNumber2, phoneNumber3, address, birthDate } = formData;

useEffect(() => {
    if (userData) {
        const [phone1 = "", phone2 = "", phone3 = ""] = (userData.phoneNumber || "").split("-");
        setFormData({
            fullName: userData.fullName || "",
            phoneNumber1: phone1,
            phoneNumber2: phone2,
            phoneNumber3: phone3,
            address: userData.address || "",
            birthDate: userData.birthDate || "",
        });
    }
}, [userData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // フォームデータの更新
    setFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));

    // 住所の場合は追加のバリデーションを行う
    if (name === "address") {
        const addressRegex = /^[\u4E00-\u9FAF\u3040-\u309F\u30A0-\u30FF0-9０-９\-ー\s]+[都道府県市区町村町村郡]+[\u4E00-\u9FAF0-9０-９\-ー\s]+$/;
        setIsAddressValid(addressRegex.test(value));
    }
};
const handleSubmit = async (e) => {
    e.preventDefault();

    // 電話番号の検証
    const phoneRegex = /^0\d{1,4}-\d{1,4}-\d{3,4}$/;
    const phoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;

    // 日本の住所検証
    const addressRegex = /^[ァ-ヶ一-龯々〆〤0-9a-zA-Z\s、，・\-]+$/;

    // 電話番号と住所の検証
    if (!phoneRegex.test(phoneNumber)) {
        setIsPhoneValid(false);
        return;
    } else {
        setIsPhoneValid(true); // 電話番号が有効な場合は有効と設定
    }

    if (!addressRegex.test(address)) {
        setIsAddressValid(false); // 住所が無効な場合はエラーを表示
        return;
    } else {
        setIsAddressValid(true); // 住所が有効な場合は有効と設定
    }

    try {
        if (userData?.id) {
            const userDocRef = doc(db, "users", userData.id);
            await updateDoc(userDocRef, {
                fullName,
                phoneNumber,
                address,
                birthDate,
            });
            alert("プロフィールが更新されました。");
            router.push("/");
        } else {
            alert("ユーザーデータが見つかりません。");
        }
    } catch (err) {
        console.error(err);
        alert("プロフィールの更新中にエラーが発生しました。");
    }
};

  if (loading) {
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
          className="flex items-center px-4 py-3 font-bold border border-gray-400 rounded-lg transition-all duration-200"
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
    className="py-3.5 px-7 text-base font-medium text-white bg-black rounded-lg border border-gray-600 hover:bg-gray-900 focus:ring-4 focus:ring-gray-500 transition-all duration-300"
  >
    画像を変更
  </button>
  <button
    type="button"
    className="py-3.5 px-7 text-base font-medium text-black bg-white rounded-lg border border-gray-600 hover:bg-gray-200 hover:text-black focus:ring-4 focus:ring-gray-500 transition-all duration-300"
  >
    画像を削除
  </button>
</div>

              </div>
              <div className="items-center mt-8 text-[#202142]">
                <div className="flex flex-col sm:flex-row sm:space-x-4 sm:mb-6">
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6">
                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-indigo-900">
                        名前
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-indigo-900">
                        電話番号
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            id="phoneNumber1"
                            name="phoneNumber1"
                            value={phoneNumber1}
                            onChange={handleChange}
                            maxLength="4"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            placeholder="090"
                            required
                        />
                        <span>-</span>
                        <input
                            type="text"
                            id="phoneNumber2"
                            name="phoneNumber2"
                            value={phoneNumber2}
                            onChange={handleChange}
                            maxLength="4"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            placeholder="xxxx"
                            required
                        />
                        <span>-</span>
                        <input
                            type="text"
                            id="phoneNumber3"
                            name="phoneNumber3"
                            value={phoneNumber3}
                            onChange={handleChange}
                            maxLength="4"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                            placeholder="xxxx"
                            required
                        />
                    </div>
                    {!isPhoneValid && (
                        <div className="text-red-500 text-sm mt-2">
                            有効な電話番号を入力してください（例: 090-xxxx-xxxx）。
                        </div>
                    )}
                </div>
                <div className="mb-6">
                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-indigo-900">
                        住所
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={address}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        placeholder="東京都渋谷区"
                        required
                    />
                    {!isAddressValid && (
                        <div className="text-red-500 text-sm mt-2">
                            有効な住所を入力してください（例: 東京都渋谷区渋谷1丁目）。
                        </div>
                    )}
                </div>
                <div className="mb-6">
                    <label htmlFor="birthDate" className="block mb-2 text-sm font-medium text-indigo-900">
                        生年月日
                    </label>
                    <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={birthDate}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        required
                        max={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center transition-all duration-300 ease-in-out hover:scale-105"
                        >
                        保存
                    </button>
                </div>
            </form>
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
