import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../../firebaseConfig";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Breadcrumb from "@/components/Breadcrumb";

const ProductEditPage = () => {
  const router = useRouter();
  const { user, loading: authloading } = useAuthGuard();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        detail: "",
        imageUrls: [],
    });
    const [newImage, setNewImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data());
                    setFormData({
                        name: docSnap.data().name || "",
                        price: docSnap.data().price || "",
                        detail: docSnap.data().detail || "",
                        imageUrls: docSnap.data().imageUrls || [],
                    });
                } else {
                    console.log("No such document!");
                }
            }
        };
        fetchProduct();
    }, [id]);

const uploadImage = async (file) => {
    const storageRef = ref(storage, `products/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};

const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedImageUrls = [...formData.imageUrls];
            if (newImage) {
                const imageUrl = await uploadImage(newImage);
                updatedImageUrls.push(imageUrl);
            }

            const docRef = doc(db, "products", id);
            await updateDoc(docRef, {
                ...formData,
                imageUrls: updatedImageUrls,
            });

            alert("商品情報を更新しました！");
            router.push("/listing-history");
        } catch (error) {
            console.error("エラー:", error);
            alert("更新に失敗しました。");
        }
    };

const handleDelete = async () => {
        if (confirm("この商品を削除しますか？")) {
            try {
                const docRef = doc(db, "products", id);
                await deleteDoc(docRef);

                alert("商品を削除しました！");
                router.push("/listing-history");
            } catch (error) {
                console.error("エラー:", error);
                alert("削除に失敗しました。");
            }
        }
    };


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
          className="flex items-center px-4 py-3 font-bold border border-gray-400 rounded-lg transition-all duration-200"
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
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">出品中の商品の編集</h2>
            <div className="grid max-w-2xl mx-auto mt-8">

            <Breadcrumb items={[
                { href: "/listing-history", label: "出品中の商品" },
                { label: "商品の編集" },
            ]} />
            <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-indigo-900">商品名</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-indigo-900">価格</label>
                <input
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-indigo-900">詳細</label>
                <textarea
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-indigo-900">現在の画像</label>
                <ul className="grid grid-cols-2 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <li key={index} className="relative w-full h-40">
                      <Image src={url} alt="商品画像" layout="fill" objectFit="cover" className="rounded-lg" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-indigo-900">新しい画像を選択</label>
                <input type="file" onChange={(e) => setNewImage(e.target.files[0])} className="w-full" />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="px-6 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  更新
                </button>
                <button type="button" className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700" onClick={handleDelete}>
                  削除
                </button>
              </div>
            </form>
      </main>

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

export default ProductEditPage;