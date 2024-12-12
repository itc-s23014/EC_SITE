import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useShoppingCart, clearCart } from 'use-shopping-cart';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from "../../../firebaseConfig";
import { getAuth } from 'firebase/auth';
import LoadingComponent from '@/components/LoadingComponent';

const containerStyle = {
  fontFamily: 'Arial, sans-serif',
  maxWidth: '600px',
  margin: '20px auto',
  padding: '20px',
};

const headingStyle = {
  textAlign: 'center',
  fontSize: '1.5rem',
  marginBottom: '20px',
  color: '#333',
};

const sectionStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '15px',
  marginBottom: '20px',
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '5px',
};

const totalRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 'bold',
  fontSize: '1.2rem',
};

const buttonStyle = {
  marginTop: '20px',
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default function SelectPaymentMethod() {
    const { cartDetails, cartCount, formattedTotalPrice, clearCart } = useShoppingCart();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [directProduct, setDirectProduct] = useState(null);
    const router = useRouter();
    const { productId } = router.query;

    useEffect(() => {
        if (productId) {
            // productIdがURLに存在する場合は、Firestoreから商品データを取得
            const fetchProductData = async () => {
                try {
                    const productRef = doc(db, "products", productId);
                    const productSnap = await getDoc(productRef);

                    if (productSnap.exists()) {
                        setDirectProduct(productSnap.data());
                    } else {
                        console.error("No such product");
                    }
                } catch (error) {
                    console.error("Error fetching product data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProductData();
        } else {
            // productIdがURLに存在しない場合は、カートデータを表示
            if (cartDetails && Object.keys(cartDetails).length > 0) {
                const cartItems = Object.values(cartDetails);
                setProducts(cartItems);
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    }, [productId, cartDetails]);

    if (loading) {
        return <LoadingComponent />
    }

    // 商品データがない場合の表示
    if (!directProduct && products.length === 0) {
        return <div>商品が見つかりませんでした。</div>;
    }

    // カート内の合計金額を計算
    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // 合計金額に代金引換手数料300円を追加
    const totalAmount = directProduct
        ? directProduct.price + 300
        : calculateTotal(products) + 300;

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>代金引換</h1>

            {directProduct ? (
                <div style={sectionStyle}>
                    <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>商品情報</h2>
                    <div style={rowStyle}>
                        <span>商品名</span>
                        <span>{directProduct.name}</span>
                    </div>
                    <div style={rowStyle}>
                        <span>商品代金</span>
                        <span>${directProduct.price}</span>
                    </div>
                    <div style={rowStyle}>
                        <span>代金引換手数料</span>
                        <span>¥300</span>
                    </div>
                    <hr />
                    <div style={totalRowStyle}>
                        <span>合計金額</span>
                        <span>${totalAmount}</span>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>カート内の商品</h2>
                    {products.map((product, index) => (
                        <div key={index} style={sectionStyle}>
                            <div style={rowStyle}>
                                <span>商品名</span>
                                <span>{product.name}</span>
                            </div>
                            <div style={rowStyle}>
                                <span>商品代金</span>
                                <span>${product.price}</span>
                            </div>
                            <div style={rowStyle}>
                                <span>個数</span>
                                <span>{product.quantity}</span>
                            </div>
                            <div style={rowStyle}>
                                <span>小計</span>
                                <span>${product.price * product.quantity}</span>
                            </div>
                        </div>
                    ))}
                    <hr />
                    <div style={totalRowStyle}>
                        <span>合計金額</span>
                        <span>${totalAmount}</span>
                    </div>
                </div>
            )}

            <div>
                <button
                    style={buttonStyle}
                    onClick={() => {
                        alert("ご注文を確定しました");
                        clearCart();
                    }}
                >
                    ご注文を確定する
                </button>
            </div>
        </div>
    );
}
