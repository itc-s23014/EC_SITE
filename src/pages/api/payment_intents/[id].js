import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} not allowed`);
    }

    const { id } = req.query;

    try {
        const paymentMethod = await stripe.paymentMethods.retrieve(id);
        res.status(200).json(paymentMethod);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}

export default handler;
