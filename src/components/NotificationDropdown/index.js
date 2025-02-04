import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from "next/link";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]); // 通知の状態管理
  const [user, setUser] = useState(null); // ユーザー状態管理
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // ユーザー認証状態の監視
  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribeAuth();
  }, []);

  // Firebase から通知を取得
  useEffect(() => {
    if (user) {
      const sellerNotificationsQuery = query(
          collection(db, 'notifications'),
          where('sellerId', '==', user.uid)
      );

      const buyerNotificationsQuery = query(
          collection(db, 'notifications'),
          where('buyer_id', '==', user.uid)
      );


      const unsubscribeSeller = onSnapshot(sellerNotificationsQuery, (snapshot) => {
        const sellerNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications((prevNotifications) => [
          ...prevNotifications.filter((n) => n.sellerId !== user.uid),
          ...sellerNotifications,
        ]);
      });

      const unsubscribeBuyer = onSnapshot(buyerNotificationsQuery, (snapshot) => {
        const buyerNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications((prevNotifications) => [
          ...prevNotifications.filter((n) => n.buyer_id !== user.uid),
          ...buyerNotifications,
        ]);
      });

      return () => {
        unsubscribeSeller();
        unsubscribeBuyer();
      };
    }
  }, [user]);
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
      <div ref={dropdownRef} className="relative font-[sans-serif] w-max mx-auto">
        <button
            onClick={handleClick}
            className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out"
            aria-label="Notifications"
        >
          <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g clipPath="url(#clip0_15_159)">
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
            </g>
          </svg>
          {notifications.length > 0 && (
            <span className="absolute inset-0 object-right-top -mr-6">
              <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                {notifications.length}
              </div>
            </span>
          )}
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
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
                        >
                          <Link href={`/Trading-screen/${notification.productId}`} passHref>
                            <div style={{ textDecoration: 'none', color: 'inherit' }}>
                              <p>{notification.message}</p>
                              <p style={{ fontSize: '12px', color: '#888' }}>
                                {new Date(notification.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </Link>
                          <img
                              src={notification.image || '/default-avatar.png'}
                              alt="Notification"
                              className="w-12 h-12 rounded-full shrink-0"
                          />
                          <div className="ml-6">
                            <h3 className="text-sm text-[#333] font-semibold">
                              {notification.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-blue-600 leading-3 mt-2">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </li>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 p-4">通知はありません。</p>
                )}
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
