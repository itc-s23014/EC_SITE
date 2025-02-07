import { useRouter } from 'next/router';
import Image from "next/image";
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../../firebaseConfig';
import Header from "@/components/Header";
import TwitterEmbed from "@/hooks/twitter";

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [sellerName, setSellerName] = useState('');
    const [user] = useAuthState(auth);
    const [twitterUserId, setTwitterUserId] = useState('');
    const [twitterStatusId, setTwitterStatusId] = useState('');
    const [cart, setCart] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [videoLink, setVideoLink] = useState('');
    const [mainImage, setMainImage] = useState("");
    const [mainVideo, setMainVideo] = useState("");
    useEffect(() => {
        const fetchProductAndSeller = async () => {
            if (id) {
                try {
                    const productDoc = doc(db, 'products', id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const productData = { id: productSnapshot.id, ...productSnapshot.data() };
                        setProduct(productData);
                        if (productData.imageUrls && productData.imageUrls.length > 0) {
                            setMainImage(productData.imageUrls[0]);
                        }
                        if (productData.videoLink) {
                            setVideoLink(productData.videoLink);
                            console.log(productData.videoLink);
                            const twitter = productData.videoLink.match(/https:\/\/twitter.com\/\w+\/status\/\d+/) || "";
                            console.log(twitter);
                            const twitterData = twitter[0].split('/');
                            setTwitterUserId(twitterData[3])
                            setTwitterStatusId(twitterData[5])
                            console.log(twitterData[3]);
                            console.log(twitterData[5]);
                        }else {
                            console.log('動画が見つかりません')
                        }
                        const sellerId = productData.sellerId;
                        console.log('sellerId',sellerId)
                        if (sellerId) {
                            const sellerDoc = doc(db, 'sellers', sellerId);
                            const sellerSnapshot = await getDoc(sellerDoc);

                            if (sellerSnapshot.exists()) {
                                const sellerData = sellerSnapshot.data();
                                console.log(sellerData)
                                setSellerName(sellerData.sellerName);
                            } else {
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

        fetchProductAndSeller();
    }, [id]);

    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
                const cartSnapshot = await getDoc(userCartRef);
                if (cartSnapshot.exists()) {
                    setCart(cartSnapshot.data().cartDetails || {});
                } else {
                    setCart({});
                }
            }
        };
        fetchCart();
    }, [user]);

    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (user && id) {
                const likeRef = doc(db, 'likes', `${user.uid}_${id}`);
                const likeSnapshot = await getDoc(likeRef);
                setIsLiked(likeSnapshot.exists());
            }
        };
        fetchLikeStatus();
    }, [user, id]);



    const handleLikeToggle = async () => {
        if (!user) {
            alert('いいねするにはログインしてください！');
            return;
        }
        const likeRef = doc(db, 'likes', `${user.uid}_${id}`);
        try {
            if (isLiked) {
                await deleteDoc(likeRef);
                setIsLiked(false);
            } else {
                await setDoc(likeRef, {
                    productId: id,
                    userId: user.uid,
                    likedAt: new Date(),
                });
                setIsLiked(true);
            }
        } catch (error) {
            console.error('いいね操作エラー:', error);
        }
    };

    const handleAddToCart = async () => {
        if (product && user && !cart[product.id]) {
            const newCart = {
                ...cart,
                [product.id]: {
                    name: product.name,
                    price: product.price,
                    quantity: (cart[product.id]?.quantity || 0) + 1,
                },
            };

            setCart(newCart);
            const userCartRef = doc(db, 'sellers', user.uid, 'cart', 'currentCart');
            await setDoc(userCartRef, { cartDetails: newCart, timestamp: new Date() });
            // alert(`${product.name} をカートに追加しました`);
        }
    };

    const purchase = () => {
        if (!product?.id) {
            console.error('商品IDが取得できません');
            return;
        }
        router.push({
            pathname: '/select-purchase',
            query: { productId: product.id },
        });
    };

    if (!product) {
        return <div>読み込み中...</div>;
    }



    return (
        <>
            <Header />
            <div className="font-san">
      <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto mt-16">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">

              <div className="px-4 py-10 rounded shadow-md relative">
                  <div style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      position: 'relative'
                  }}>
                      <Image
                          src={isLiked ? '/image/heart_filled_red.svg' : '/image/heart.svg'}
                          alt="いいね"
                          width={40}
                          height={40}
                          style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              cursor: 'pointer',
                              filter: isLiked ? 'hue-rotate(0deg) saturate(1000%) brightness(0.8)' : 'none'
                          }}
                          onClick={handleLikeToggle}
                      />
                  </div>

                  <Image src={mainImage} alt="Product" width={500} height={500}
                         className="w-4/5 aspect-[251/171] rounded object-cover mx-auto"/>


              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
                  {product.imageUrls && product.imageUrls.map((url, index) => (
                      <Image
                          key={index}
                          src={url}
                          alt={`${product.name} - 画像${index + 1}`}
                          width={500}
                          height={500}
                          className="w-2o h16 sm:w-24 sm:h-20 flex items-center justify-center rounded p-2 shadow-md cursor-pointer"
                          onClick={() => setMainImage(url)}
                      />
                  ))}
                  <TwitterEmbed videoLink={videoLink} twitterStatusId={twitterStatusId} twitterUserId={twitterUserId}/>
              </div>
          </div>

            <div className="lg:col-span-2">
                <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-gray-200 text-gray-500">{product.category}</span>
          <h3 className="text-xl font-bold text-gray-800 mt-4">{product.name}</h3>

          {/* 出品者情報 */}
<div className="flex items-center mt-2 text-gray-600 text-sm">
  {/* 背景付きアイコン */}
  <div className="mt-1 relative w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full">
    <svg
      className="w-7 h-7 text-gray-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  </div>

  {/* 出品者ラベル + 名前 */}
  <div className="ml-2">
    <span className="text-xs text-gray-500">出品者</span>
    <p className="text-base font-semibold text-gray-800">{sellerName}</p>
  </div>
</div>


            <p className="text-s text-gray-500 mt-4">{product.description}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <p className="text-gray-800 text-2xl font-bold">¥ {product.price.toLocaleString()}</p>
            </div>


            <div className="flex gap-4 mt-12 max-w-md">
            <button type="button" className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide border border-gray-300 rounded-md ${cart[product.id] ? "bg-gray-200 text-gray-500 opacity-50 cursor-not-allowed" : "bg-transparent hover:bg-gray-200 text-gray-800"}`} onClick={handleAddToCart} disabled={cart[product.id]}>{cart[product.id] ? '追加済み' : 'カートに追加'}</button>
            <button type="button" className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-800 hover:bg-gray-900 text-white rounded-md`} onClick={purchase}>購入</button>
            </div>
          </div>
        </div>
      </div>
    </div>
        </>
    );
};

export default ProductDetail;
