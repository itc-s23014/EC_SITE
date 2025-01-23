import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import Image from 'next/image';
import styles from './style.module.css';
import Carousel from '@/components/Carousel';
import AvatarDropdown from '@/components/AvatarDropdown';
import SearchBar from '@/components/SearchBar';

const TestPage = () => {
  const [products, setProducts] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

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
        }))
            .filter((product) => !product.isHidden);
        setProducts(productsList);
    };

    fetchProducts();
}, []);


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
              <li class='max-lg:border-b max-lg:py-3 px-3'><a href='javascript:void(0)'
                class='text-[#007bff] hover:text-[#007bff] text-[15px] block font-semibold'>New</a></li>
              <li class='max-lg:border-b max-lg:py-3 px-3'><a href='javascript:void(0)'
                class='text-[#333] hover:text-[#007bff] text-[15px] block font-semibold'>Men</a></li>
              <li class='max-lg:border-b max-lg:py-3 px-3'><a href='javascript:void(0)'
                class='text-[#333] hover:text-[#007bff] text-[15px] block font-semibold'>Women</a></li>
              <li class='max-lg:border-b max-lg:py-3 px-3'><a href='javascript:void(0)'
                class='text-[#333] hover:text-[#007bff] text-[15px] block font-semibold'>Kids</a></li>
            </ul>
          </div>

          <SearchBar />

            <div class='flex items-center sm:space-x-8 space-x-6'>
              <div class="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" class="cursor-pointer fill-[#333] inline w-5 h-5"
                    viewBox="0 0 64 64">
                    <path
                      d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"
                      data-original="#000000" />
                  </svg>
                  <span class="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">0</span>
                </div>
                <span class="text-[13px] font-semibold text-[#333]">Wishlist</span>
              </div>
              <div class="flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" class="cursor-pointer fill-[#333] inline"
                    viewBox="0 0 512 512">
                    <path
                      d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                      data-original="#000000"></path>
                  </svg>
                  <span class="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">0</span>
                </div>
                <span class="text-[13px] font-semibold text-[#333]">Cart</span>
              </div>

              <AvatarDropdown />

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

<Carousel />

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