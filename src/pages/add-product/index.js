import { useState, useEffect } from 'react';
import { addDoc, collection, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebaseConfig';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { useAuthGuard } from '@/hooks/useAuthGuard';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [priceError, setPriceError] = useState('');
    const router = useRouter();
    const auth = getAuth();
    const { user, loading: authloading } = useAuthGuard();

    const categories = [
        'ファッション',
        'ベビー・キッズ',
        'ゲーム・おもちゃ・グッズ',
        'ホビー・楽器・アート',
        'チケット',
        '本・雑誌・漫画',
        'CD・DVD・ブルーレイ',
        'スマホ・タブレット・パソコン',
        'テレビ・オーディオ・カメラ',
        '生活家電・空調',
        'スポーツ',
        'アウトドア・釣り・旅行用品',
        'コスメ・美容',
        'ダイエット・健康',
        '食品・飲料・酒',
        'キッチン・日用品・その他',
        '家具・インテリア',
        'ペット用品',
        'DIY・工具',
        'フラワー・ガーデニング',
        'ハンドメイド・手芸',
        '車・バイク・自転車'
    ];

    useEffect(() => {
        const fetchSellerName = async () => {
            const user = auth.currentUser;
            if (user) {
                const sellerDoc = doc(db, 'sellers', user.uid);
                const sellerSnapshot = await getDoc(sellerDoc);

                if (sellerSnapshot.exists()) {
                    setSellerName(sellerSnapshot.data().sellerName);
                }
            }
        };

        fetchSellerName();
    }, [auth]);

    const uploadImages = async (files) => {
        const uploadPromises = files.map((file) => {
            const fileRef = ref(storage, `products/${uuidv4()}`);
            return uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
        });
        return Promise.all(uploadPromises);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (price.startsWith('0')) {
            setPriceError('価格は0から始めることはできません');
            return;
        }

        if (parseFloat(price) <= 0 || parseFloat(price) > 10000000) {
            setPriceError('価格は0より大きく、1000万以下でなければなりません');
            return;
        } else {
            setPriceError('');
        }

        if (files.length === 0) {
            alert('画像を選択してください。');
            return;
        }

        if (!selectedCategory) {
            alert('カテゴリーを選択してください。');
            return;
        }

        try {
            const imageUrls = await uploadImages(files);

            const user = auth.currentUser;
            const sellerId = user ? user.uid : null;

            const docRef = doc(collection(db, 'products'));

            const productId = docRef.id;

            await setDoc(docRef, {
                productId,
                name,
                price: parseFloat(price),
                description,
                category: selectedCategory,
                imageUrls,
                createdAt: serverTimestamp(),
                sellerId,
                hidden: false
            });

            alert('商品が追加されました！');
            router.push('/Catalog');
        } catch (error) {
            console.error('商品追加エラー: ', error);
            alert('商品追加に失敗しました。もう一度お試しください。');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>商品を追加する</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
                <label>商品名:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label>価格:</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                {priceError && <p style={{ color: 'red' }}>{priceError}</p>}

                <label>カテゴリー:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                >
                    <option value="" disabled>カテゴリーを選択してください</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>

                <label>説明:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <label>画像:</label>
                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    accept="image/*"
                    required
                />

                <button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    商品を追加する
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
