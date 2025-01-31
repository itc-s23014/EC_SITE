import { useRouter } from "next/router";
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import Image from "next/image";
import useProducts from "@/hooks/useProducts";


const ProductsPage = () => {
  const router = useRouter();
  const { user: authUser, loading: authloading } = useAuthGuard();
  const { products, deleteProduct } = useProducts(authUser);

  const handleDelete = (productId) => {
    const isConfirmed = window.confirm("この商品を削除しますか？");
    if (isConfirmed) {
        deleteProduct(productId);
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
      <h2 className="pl-6 text-2xl font-bold sm:text-xl">出品中の商品</h2>
    <div className="grid max-w-2xl mx-auto mt-8">
            {products.length === 0 ? (
    <p className="text-gray-600 text-lg mt-4">現在出品している商品はありません。</p>
) : (
    <div className="grid rounded-md grid-cols-1 gap-6">
    {products.map((product) => {
        const imageUrl = product.imageUrls[0] || "/placeholder.jpg";

        return (
            <div key={product.id} className="flex bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)] w-full">
            <div className="flex gap-4">
                <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
                    <Image src={imageUrl} alt={product.name} width={500} height={500} className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{product.name}</h3>
                </div>
            </div>
            <div className="ml-auto flex flex-col">
                <div className="flex items-start gap-4 justify-end">
                    <div className="flex items-start gap-4 justify-end">
                        {/* 歯車アイコン */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 cursor-pointer fill-gray-400 hover:fill-blue-600 inline-block" viewBox="0 0 54 54" onClick={() => router.push(`/listing-history/producteditpage/${product.id}`)}>
                            <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553 c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z" />
                        </svg>
                    </div>
                    <div className="flex items-start gap-4 justify-end">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 cursor-pointer fill-gray-400 hover:fill-red-600 inline-block" viewBox="0 0 24 24" onClick={() => handleDelete(product.id)}>
                            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-sm ms:text-xl font-normal text-gray-800 mt-auto">{product?.price}円</h3>
            </div>
        </div>

        );
    })}
</div>

)
}
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

export default ProductsPage;