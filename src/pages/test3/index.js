import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../firebaseConfig";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';

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
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">出品中の商品の編集</h2>
            <div className="grid max-w-2xl mx-auto mt-8">

                AA

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