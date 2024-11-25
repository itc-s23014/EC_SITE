import { stripe } from '../../../libs/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const { productId } = req.body;


    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productDoc);

    if (!productSnapshot.exists()) {
      return { error: '商品が見つかりませんでした' };
    }

    const productData = productSnapshot.data();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: productData.name,
            },
            unit_amount: productData.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/Trading-screen?productId=${productId}`,
      cancel_url: 'http://localhost:3000/select-purchase',
    });

    res.status(200).json({ checkout_url: session.url });
  } catch (error) {
    console.error('Stripeセッション作成エラー:', error);
    res.status(500).json({ error: 'Stripeセッション作成に失敗しました' });
  }
}
