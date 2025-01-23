import { stripe } from '../../../libs/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import admin from 'firebase-admin';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        const { productId } = req.body;

        const auth = admin.auth();
        const user = await auth.verifyIdToken(req.headers.authorization);
        const userId = user.uid;
        console.log("現在のユーザー:",userId)
        const cartRef = doc(db, 'sellers', userId, 'cart', 'currentCart');
        const cartSnapshot = await getDoc(cartRef);

        if (!cartSnapshot.exists()) {
            return res.status(404).json({ error: 'カートが空です' });
        }

        const cartData = cartSnapshot.data();
        const lineItems = [];

        Object.values(cartData).forEach((item) => {
            const { name, price, quantity } = item;


            if (!name || !price) {
                throw new Error('カートアイテムに必要な情報が不足しています');
            }

            lineItems.push({
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: name,
                    },
                    unit_amount: Math.round(price),
                },
                quantity: quantity || 1,
            });
        });

        const session = await stripe.checkout.sessions.listLineItems({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/Trading-screen?productId=${productId}`,
            cancel_url: 'http://localhost:3000/select-purchase',
        });

        res.status(200).json({ checkout_url: session.url });
    } catch (error) {
        console.error('エラー:', error);
        res.status(500).json({ error: 'サーバーエラー: セッション作成に失敗しました' });
    }
}
