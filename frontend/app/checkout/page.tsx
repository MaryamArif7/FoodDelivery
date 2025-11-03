'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe';
import CheckoutForm from '../../components/user/CheckoutForm';
import { Nav } from '@/components/common/nav';
export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const secret = localStorage.getItem('payment_client_secret');
    
    if (secret) {
      setClientSecret(secret);
      setLoading(false);
    } else {
    
      window.location.href = '/';
    }
  }, []);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0070f3',
      colorBackground: '#ffffff',
      colorText: '#000000',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  if (loading) {
    return (

      <div className="">
        <Nav />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Nav />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Complete Your Payment</h1>
        
        {clientSecret && (
          <Elements stripe={getStripe()} options={options}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}