import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('❌ ERROR: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set!');
      console.error('Please create .env.local file with your Stripe key');
      return null;
    }
    
    console.log('✅ Loading Stripe...');
    console.log('Key found:', key.substring(0, 20) + '...');
    
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

export default getStripe;