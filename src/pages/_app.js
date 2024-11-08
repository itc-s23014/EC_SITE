import "@/styles/globals.css";
import { CartProvider } from 'use-shopping-cart';

function MyApp({ Component, pageProps }) {
  return (
      <CartProvider
          mode="payment"
          cartMode="client-only"
          stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}
          successUrl="https://localhost:3000/success"
          cancelUrl="https://localhost:3000"
          currency="jpy"
       shouldPersist>
        <Component {...pageProps} />
      </CartProvider>
  );
}

export default MyApp;
