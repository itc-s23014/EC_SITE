import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from "../../../firebaseConfig";
import { useShoppingCart } from 'use-shopping-cart';
import LoadingComponent from '@/components/LoadingComponent';
import { useAuthGuard } from "@/hooks/useAuthGuard";
import useProducts from '@/hooks/useProducts';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';


const SelectPaymentMethod = () => {
    const { cartDetails, cartCount, formattedTotalPrice } = useShoppingCart();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [directProduct, setDirectProduct] = useState(null);
    const router = useRouter();
    const { productId } = router.query;
    const { user } = useAuthGuard(); //認証を強制
    const products = useProducts(user);
    const [loading, setLoading] = useState(true);

    const fetchDirectProduct = async () => {
        if (!productId) return;
        const productRef = doc(db, 'products', productId);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {
            console.log(useSearchParams);
            setDirectProduct({ id: productSnapshot.id, ...productSnapshot.data() });
            console.log('商品が見つかりました:', directProduct);
        } else {
            console.error('商品が見つかりませんでした');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (productId) {
            fetchDirectProduct();
        } else {
            setLoading(false);
        }
    }, [productId]);

    const pushed = () => {
        if (!productId) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/convenience_store_payment',
            query: { productId },
        });
    };

    const handlePurchase = () => {
        if (!selectedMethod) return;
        if (selectedMethod === 'credit-card') {
            stripe_handlePurchase();
        } else if (selectedMethod === 'convenience-store') {
            pushed();
        } else if (selectedMethod === 'cash-on-delivery') {
            router.push({
                pathname: '/cash-on-delivery',
                query: { productId }
            });
        } else {
            alert('支払い方法を選択してください');
        }
    };

    const stripe_handlePurchase = async () => {
        try {
            const res = await fetch('/api/checkout_api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            const data = await res.json();
            if (data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error('購入手続きエラー:', data.error);
            }
        } catch (error) {
            console.error('購入手続きエラー:', error);
        }
    };

    if (loading) {
        return <LoadingComponent />
    }

    return (
        <>
        <Header />
        <div className="font-sans max-w-4xl max-md:max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-gray-800 text-center">購入手続き</h1>
            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="md:col-span-2 space-y-4 overflow-hidden">
                <div className="bg-white p-4 rounded-md shadow-md">
    <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-4">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 ml-4 mt-2">{directProduct?.name}</h3>
        </div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 cursor-pointer fill-gray-400 hover:fill-red-600"
            viewBox="0 0 24 24"
            onClick={() => removeItemFromCart(productId)}
        >
            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"></path>
            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"></path>
        </svg>
    </div>
    <div className="flex justify-end">
        <h3 className="text-sm sm:text-xl font-normal text-gray-800 mt-6 text-right">
            ¥{directProduct?.price.toLocaleString()}
        </h3>
    </div>
</div>



                </div>
                <div className="bg-white rounded-md p-4 shadow-md">
                    <h2 className="text-lg font-bold">支払い方法</h2>
                    <div className="flex flex-col gap-2 mt-2">
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="credit-card" checked={selectedMethod === 'credit-card'} onChange={() => setSelectedMethod('credit-card')} className="mr-2" />
                            クレジットカード
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="convenience-store" checked={selectedMethod === 'convenience-store'} onChange={() => setSelectedMethod('convenience-store')} className="mr-2" />
                            コンビニ決済
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="cash-on-delivery" checked={selectedMethod === 'cash-on-delivery'} onChange={() => setSelectedMethod('cash-on-delivery')} className="mr-2" />
                            代金引換
                        </label>
                    </div>
                    <button onClick={handlePurchase} className="w-full mt-4 p-2 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-md">購入手続きを進める</button>
                </div>
            </div>
        </div>
        </>
    );
}
export default SelectPaymentMethod;