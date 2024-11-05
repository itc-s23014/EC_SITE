import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const productDoc = doc(db, 'products', id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);
                        console.log('商品データ:', productData);

                        const sellerId = productData.sellerId;
                        console.log(sellerId);
                        if (sellerId) {
                            const sellerDoc = doc(db, 'sellers', sellerId);
                            console.log("出品者ドキュメントのリファレンス: ,",sellerDoc);
                            const sellerSnapshot = await getDoc(sellerDoc);


                            if (sellerSnapshot.id.includes(sellerSnapshot.id)) {
                                const sellerData = sellerSnapshot.data();
                                setSellerName(sellerData.sellerName);
                                console.log('出品者データ:',sellerData);
                            } else {
                                console.log('出品者が見つかりませんでした！',sellerSnapshot);
                                setSellerName('不明');
                            }
                        } else {
                            console.log('sellerIdが見つかりません！');
                        }
                    } else {
                        console.log('商品が見つかりませんでした！');
                    }
                } catch (error) {
                    console.error('商品取得エラー:', error);
                }
            }
        };

        fetchProduct();
    }, [id]);

    const handlePurchase = () => {
        alert(`購入しました: ${product.name}`);
    };

    if (!product) {
        return <div>読み込み中...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2rem', color: '#333' }}>{product.name}</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {product.imageUrls && product.imageUrls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`${product.name} - 画像${index + 1}`}
                        style={{
                            width: '100%',
                            maxWidth: '250px',
                            height: 'auto',
                            borderRadius: '8px',
                            margin: '10px'
                        }}
                    />
                ))}
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#333', marginTop: '20px' }}>詳細</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#555' }}>{product.description}</p>
            <h2 style={{ fontSize: '1.5rem', color: '#333', marginTop: '20px' }}>出品者</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#555' }}>{sellerName || '不明'}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                <strong>価格:</strong> ¥{product.price.toLocaleString()}
            </p>
            <div style={{ textAlign: 'center' }}>
                <button
                    onClick={handlePurchase}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    今すぐ購入
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
