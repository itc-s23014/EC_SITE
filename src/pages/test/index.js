import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Image from 'next/image';
import styles from './style.module.css';
import Carousel from '@/components/Carousel';
import AvatarDropdown from '@/components/AvatarDropdown';
import SearchBar from '@/components/SearchBar';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const TestPage = () => {
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sellerName, setSellerName] = useState("");
  const [userdata, setUserdata] = useState(null);
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState('');

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter((product) => !product.isHidden);
      setProducts(productsList);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser.uid;
        console.log('uid', uid);

        const userQuery = query(collection(db, "users"), where("userId", "==", uid));
        const userSnapshot = await getDocs(userQuery);
        console.log('userSnapshot', userSnapshot.docs[0].data());
        setUserdata(userSnapshot.docs[0].data());


        const sellerDoc = doc(db, "sellers", uid);
        const sellerSnapshot = await getDoc(sellerDoc);

        if (sellerSnapshot.exists()) {
          const sellerData = sellerSnapshot.data();
          setSellerName(sellerData.sellerName);
          setEmail(sellerData.email);
        } else {
          console.error("セラーデータが見つかりませんでした");
        }

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          console.error("ユーザーデータが見つかりませんでした");
        }
      } catch (error) {
        console.error("ユーザーデータの取得中にエラーが発生しました", error);
      } finally {
        setLoading(false); // ローディング状態を解除
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  return (
    <div className={styles.container}>
    <header className='flex bg-white border-b py-3 sm:px-6 px-4 font-[sans-serif] min-h-[75px] tracking-wide relative z-50'>
      <div className='flex max-w-screen-xl mx-auto w-full'>
        <div className='flex flex-wrap items-center lg:gap-y-2 gap-4 w-full'>
          <a href="javascript:void(0)" class="max-sm:hidden"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" class='w-36' />
          </a>
          <a href="javascript:void(0)" class="hidden max-sm:block"><img src="https://readymadeui.com/readymadeui-short.svg" alt="logo" class='w-9' />
          </a>

          <div id="collapseMenu"
            class='lg:ml-6 max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50'>
            <button id="toggleClose" class='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border'>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 fill-black" viewBox="0 0 320.591 320.591">
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"></path>
              </svg>
            </button>

            <ul
              class='lg:flex lg:gap-x-3 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
              <li class='mb-6 hidden max-lg:block'>
                <div class="flex items-center justify-between gap-4">
                  <a href="javascript:void(0)"><img src="https://readymadeui.com/readymadeui.svg" alt="logo" class='w-36' />
                  </a>
                  <button
                    class='px-4 py-2 text-sm rounded-full text-white border-2 border-[#007bff] bg-[#007bff] hover:bg-[#004bff]'>Sign
                    In</button>
                </div>
              </li>
            </ul>

          </div>

          <SearchBar />

          <div class='flex items-center sm:space-x-8 space-x-6'>
          <div
  className="flex flex-col items-center justify-center gap-0.5 cursor-pointer"
  onClick={() => router.push('/')}
>
  <button className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out" aria-label="Notifications">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g clipPath="url(#clip0_15_159)">
          <rect width="24" height="24" fill="white"></rect>
          <path d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18.1446 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19" stroke="#000000" strokeLinejoin="round"></path>
          <path d="M12 5V3" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"></path>
        </g>
        <defs>
          <clipPath id="clip0_15_159">
            <rect width="24" height="24" fill="white"></rect>
          </clipPath>
        </defs>
      </g>
    </svg>
    <span className="absolute inset-0 object-right-top -mr-6">
      <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
        6
      </div>
    </span>
  </button>
</div>

<div className="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={() => router.push('/like-list')}>
  <button className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out" aria-label="Likes">
    <svg fill="#000000" height="50px" width="50px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 471.701 471.701" xmlSpace="preserve" className="h-6 w-6">
      <g>
        <path d="M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"></path>
      </g>
    </svg>
    <span className="absolute inset-0 object-right-top -mr-6">
      <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
        6
      </div>
    </span>
  </button>
</div>

            <div class="flex flex-col items-center justify-center gap-0.5 cursor-pointer" onClick={() => router.push('/cart')}>
              <button class="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out" aria-label="Cart">
                <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="absolute inset-0 object-right-top -mr-6">
                  <div class="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                    6
                  </div>
                </span>
              </button>
            </div>


            <AvatarDropdown sellerName={sellerName} email={email}/>

              <button id="toggleOpen" class='lg:hidden'>
                <svg class="w-7 h-7" fill="#333" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
    </header>

      <Carousel/>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>クーポン利用可能な商品</h2>
  <div className="font-sans px-4 py-8">
    <div className="mx-auto lg:max-w-6xl md:max-w-4xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
            <div className="w-full overflow-hidden mx-auto">
              <Image
                src={product.imageUrls[0] || '/placeholder.jpg'}
                alt={product.name}
                width={500}
                height={500}
                className="aspect-[108/82] w-full object-contain"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-sm font-bold text-gray-800">{product.name}</h3>
              <h4 className="text-sm text-blue-600 font-bold mt-2">${product.price}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

<section className={styles.section}>
  <h2>注目のおすすめ商品</h2>
  <div class="font-sans px-4 py-8">
    <div class="mx-auto lg:max-w-6xl md:max-w-4xl">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch1.webp" alt="product1"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">French Timex</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$95.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/product14.webp" alt="product2"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Echo Elegance</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$20.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/laptop4.webp" alt="product3"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Acer One 14 AMD</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$400.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch4.webp" alt="product4"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Irish Cream Dream</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$11.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/coffee7.webp" alt="product5"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Luxury desk clock</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$90.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch7.webp" alt="product6"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Smart Watch</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$110.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch8.webp" alt="product7"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Creative Wall Clock</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$50.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/laptop2.webp" alt="product8"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">ASUS Vivobook 15</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$450.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch3.webp" alt="product1"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">French Timex</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$95.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/product14.webp" alt="product2"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Echo Elegance</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$20.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/laptop4.webp" alt="product3"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Acer One 14 AMD</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$400.00</h4>
          </div>
        </div>

        <div class="bg-white p-3 cursor-pointer shadow-sm rounded-md hover:scale-[1.03] transition-all">
          <div class="w-full overflow-hidden mx-auto">
            <img src="https://readymadeui.com/images/watch5.webp" alt="product4"
              class="aspect-[108/82] w-full object-contain" />
          </div>
          <div class="text-center mt-4">
            <h3 class="text-sm font-bold text-gray-800">Irish Cream Dream</h3>
            <h4 class="text-sm text-blue-600 font-bold mt-2">$11.00</h4>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

      <section className={styles.section}>
        <h2>カテゴリから探す</h2>
        <div className={styles.categoryList}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={styles.category}>
              <div className={styles.categoryIcon}></div>
              <p>カテゴリ名</p>
              <span>&gt;</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>ランキング</h2>
        <div className={styles.rankList}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.rank}>
              <p>{i + 1}位</p>
              <div className={styles.rankIcon}></div>
              <p>商品名が入ります</p>
              <p>商品の説明が入ります。商品の説明が入ります。</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TestPage;