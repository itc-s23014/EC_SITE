import { useState, useEffect, useRef } from 'react';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // ドロップダウンの参照を作成

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // ドロップダウン外のクリックを検出
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef} // ドロップダウン要素に参照を追加
      type="button"
      id="dropdownToggle"
      onClick={handleClick}
      className="relative font-[sans-serif] w-max mx-auto"
    >
      <button
        className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
        aria-label="Notifications"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <g clipPath="url(#clip0_15_159)">
              <rect width="24" height="24" fill="white"></rect>
              <path
                d="M9.5 19C8.89555 19 7.01237 19 5.61714 19C4.87375 19 4.39116 18.2177 4.72361 17.5528L5.57771 15.8446C5.85542 15.2892 6 14.6774 6 14.0564C6 13.2867 6 12.1434 6 11C6 9 7 5 12 5C17 5 18 9 18 11C18 12.1434 18 13.2867 18 14.0564C18 14.6774 18.1446 15.2892 18.4223 15.8446L19.2764 17.5528C19.6088 18.2177 19.1253 19 18.382 19H14.5M9.5 19C9.5 21 10.5 22 12 22C13.5 22 14.5 21 14.5 19M9.5 19C11.0621 19 14.5 19 14.5 19"
                stroke="#000000"
                strokeLinejoin="round"
              ></path>
              <path
                d="M12 5V3"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
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
            7
          </div>
        </span>
      </button>

      {isOpen && (
        <div
          id="dropdownMenu"
          className="absolute block right-0 shadow-lg bg-white py-4 z-[1000] min-w-full rounded-lg w-[410px] max-h-[500px] overflow-auto mt-2"
        >
          <div className="flex items-center justify-between px-4 mb-4">
            <p className="text-xs text-blue-600 cursor-pointer">すべて削除</p>
            <p className="text-xs text-blue-600 cursor-pointer">既読を付ける</p>
          </div>

          <ul className="divide-y">
            <li className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
              <img
                src="https://readymadeui.com/profile_2.webp"
                className="w-12 h-12 rounded-full shrink-0"
              />
              <div className="ml-6">
                <h3 className="text-sm text-[#333] font-semibold">
                  〜の取引ページが開かれました。
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Hello there, check this new items in from the your may interested from the motion school.
                </p>
                <p className="text-xs text-blue-600 leading-3 mt-2">10分前</p>
              </div>
            </li>

            <li className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
              <img
                src="https://readymadeui.com/team-2.webp"
                className="w-12 h-12 rounded-full shrink-0"
              />
              <div className="ml-6">
                <h3 className="text-sm text-[#333] font-semibold">
                  Your have a new message from Haper
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Hello there, check this new items in from the your may interested from the motion school.
                </p>
                <p className="text-xs text-blue-600 leading-3 mt-2">2 hours ago</p>
              </div>
            </li>

            <li className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
              <img
                src="https://readymadeui.com/team-3.webp"
                className="w-12 h-12 rounded-full shrink-0"
              />
              <div className="ml-6">
                <h3 className="text-sm text-[#333] font-semibold">
                  Your have a new message from San
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Hello there, check this new items in from the your may interested from the motion school.
                </p>
                <p className="text-xs text-blue-600 leading-3 mt-2">1 day ago</p>
              </div>
            </li>

            <li className="p-4 flex items-center hover:bg-gray-50 cursor-pointer">
              <img
                src="https://readymadeui.com/team-4.webp"
                className="w-12 h-12 rounded-full shrink-0"
              />
              <div className="ml-6">
                <h3 className="text-sm text-[#333] font-semibold">
                  Your have a new message from Seeba
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  Hello there, check this new items in from the your may interested from the motion school.
                </p>
                <p className="text-xs text-blue-600 leading-3 mt-2">30 minutes ago</p>
              </div>
            </li>
          </ul>
          <p className="text-xs px-4 mt-6 mb-4 inline-block text-blue-600 cursor-pointer">
            すべての通知を表示する
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
