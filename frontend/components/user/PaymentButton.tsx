'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPaymentIntent } from '@/utils/api';

export default function PaymentButton({ product, userId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const paymentData = {
        amount: product.price,
        currency: 'usd',
        userId: userId || 'guest-user-id', // Replace with actual user ID
        customerEmail: 'customer@example.com', // Replace with actual email
        productDetails: {
          name: product.name,
          description: product.description,
          quantity: 1,
        },
      };

      const response = await createPaymentIntent(paymentData);

      if (response.success) {
        // Store client secret and redirect to checkout
        localStorage.setItem('payment_client_secret', response.data.clientSecret);
        localStorage.setItem('payment_id', response.data.paymentId);
        router.push('/checkout');
      } else {
        setError('Failed to initialize payment');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold
                   hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors duration-200"
      >
        {loading ? 'Loading...' : `Buy Now - $${product.price}`}
      </button>

      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}