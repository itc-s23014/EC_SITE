import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const useNotifications = (user) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (user) {
            const notificationsQuery = query(
                collection(db, 'notifications'),
                where('sellerId', '==', user.uid)
            );

            const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
                const notificationsList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(notificationsList);
            });

            return () => unsubscribe();
        }
    }, [user]);

    return notifications;
};

export default useNotifications;
