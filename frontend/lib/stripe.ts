import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!key) {

      return null;
    }



    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export default getStripe;