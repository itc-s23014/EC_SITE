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
    const [sellerName, setSellerName] = useState('');
    const [priceError, setPriceError] = useState(''); // 価格のエラーメッセージ
    const router = useRouter();
    const auth = getAuth();
    const { user, loading: authloading } = useAuthGuard(); //認証を強制

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

        // 価格のバリデーション
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
                {priceError && <p style={{ color: 'red' }}>{priceError}</p>} {/* エラーメッセージの表示 */}

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
