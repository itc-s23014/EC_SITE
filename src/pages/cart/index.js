import React from "react";
import Image from "next/image";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import BackButton from "@/components/BackButton/BackButton";
import LoadingComponent from "@/components/LoadingComponent";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import useCart from "@/hooks/useCart";
import { useRouter } from "next/router";
import Header from "@/components/Header";

const CartContents = () => {
    const auth = getAuth();
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { user: authUser, loading: authLoading } = useAuthGuard(); // 認証を強制
    const { products, userCart, loading, removeItemFromCart } = useCart(user);

    // 商品価格合計、送料、税金の計算
    const calculateSubtotal = () => {
        if (!userCart || !userCart.cartDetails) return 0;
        return Object.keys(userCart.cartDetails).reduce((sum, productId) => {
            const item = userCart.cartDetails[productId];
            const product = products[productId];
            return sum + (product?.price || 0) * item.quantity;
        }, 0);
    };

    const subtotal = Math.floor(calculateSubtotal());
    const shipping = 5.0;
    const taxRate = 0.1; // 税率 10%
    const tax = Math.floor(subtotal * taxRate);
    const total = Math.floor(subtotal + shipping + tax);

    const handleCheckout = () => {
        router.push("/select-purchase/index2");
    };

    if (loading) {
        return <LoadingComponent />;
    }

    return (
        <>
        <Header />
        <div className="font-sans max-w-4xl max-md:max-w-xl mx-auto p-4">
            <BackButton />
            <h1 className="text-2xl font-bold text-gray-800">カート</h1>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="md:col-span-2 space-y-4">
                    {userCart && userCart.cartDetails && Object.keys(userCart.cartDetails).length > 0 ? (
                        Object.keys(userCart.cartDetails).map((productId) => {
                            const item = userCart.cartDetails[productId];
                            const product = products[productId];
                            const imageUrl = product?.imageUrls?.[0] || "/placeholder.jpg";

                            return (
                                <div key={productId} className="flex gap-4 bg-white px-4 py-6 rounded-md shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]">
<div className="flex gap-4">
    <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0">
        <Image src={imageUrl} alt={product?.name} width={500} height={500} className="w-full h-full object-contain" />
    </div>
    <div className="flex flex-col gap-4">
        <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">{product?.name}</h3>                                            </div>
        </div>
</div>
<div className="ml-auto flex flex-col">
    <div className="flex items-start gap-4 justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 cursor-pointer fill-gray-400 hover:fill-red-600 inline-block" viewBox="0 0 24 24" onClick={() => removeItemFromCart(productId)}>
            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>
            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>
        </svg>
    </div>
    <h3 className="text-sm sm:text-xl font-normal text-gray-800 mt-auto">${product?.price}</h3>
</div>
</div>
                            );
                        })
                    ) : (
                        <p>カートは空です</p>
                    )}
                </div>

                {/* 合計表示部分 */}
                <div className="bg-white rounded-md px-4 py-6 h-max shadow-[0_2px_12px_-3px_rgba(61,63,68,0.3)]">
                    <ul className="text-gray-800 space-y-4">
                        <li className="flex flex-wrap gap-4 text-sm">小計 <span className="ml-auto font-bold">{subtotal} 円</span></li>
                        <li className="flex flex-wrap gap-4 text-sm">送料 <span className="ml-auto font-bold">{shipping} 円</span></li>
                        <li className="flex flex-wrap gap-4 text-sm">税金 <span className="ml-auto font-bold">{tax} 円</span></li>
                        <hr className="border-gray-300" />
                        <li className="flex flex-wrap gap-4 text-sm font-bold">合計 <span className="ml-auto">{total} 円</span></li>
                    </ul>
                    <div className="mt-8 space-y-2">
                        <button type="button" className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide ${
        subtotal > 0 ? "bg-gray-800 hover:bg-gray-900 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"} rounded-md`} onClick={handleCheckout} disabled={subtotal <= 0}>購入</button>
                        <button type="button" className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-md" onClick={() => router.push("/")}>買い物を続ける</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default CartContents;
