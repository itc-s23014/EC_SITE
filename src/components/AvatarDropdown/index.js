import { useState } from 'react';

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        id="avatarButton"
        className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
        onClick={toggleDropdown}
      >
        <svg
          className="absolute w-12 h-12 text-gray-400 -left-1 group-hover:text-gray-600 transition-colors duration-200"
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

      {isOpen && (
        <div
          id="userDropdown"
          className="z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-200 rounded-lg shadow-lg w-44 border border-gray-300"
        >
          <div className="px-5 font-bold py-3 text-sm text-gray-900">
            <div>Bonnie Green</div>
            <div className="font-medium truncate text-gray-600">name@flowbite.com</div>
          </div>
          <ul className="py-2 text-sm text-gray-700" aria-labelledby="avatarButton">
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                設定
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                購入履歴
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                お問い合わせフォーム
              </a>
            </li>
          </ul>
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              ログイン
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
