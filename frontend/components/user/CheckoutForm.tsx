'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
  
    const details = localStorage.getItem('payment_details');
    if (details) {
      setPaymentDetails(JSON.parse(details));
    }
    console.log(' CheckoutForm Debug:');
    console.log('Stripe loaded:', !!stripe);
    console.log('Elements loaded:', !!elements);
    console.log('Payment details:', details);
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error(' Stripe or Elements not loaded');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log(' Confirming payment...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message);
        } else {
          setMessage('An unexpected error occurred.');
        }
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log(' Payment succeeded!');
        localStorage.removeItem('payment_client_secret');
        localStorage.removeItem('payment_details');
        router.push(`/payment-success?payment_intent=${paymentIntent.id}`);
      }
    } catch (err) {
      console.error(' Payment error:', err);
      setMessage('Payment failed. Please try again.');
      setIsLoading(false);
    }
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  const buttonDisabled = isLoading || !stripe || !elements;

  return (
    <div>
   
      {paymentDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>{paymentDetails.items} items</span>
              <span className="font-medium">${paymentDetails.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement options={paymentElementOptions} />
        
        <button
          disabled={buttonDisabled}
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold 
                    disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Payment...
            </span>
          ) : (
            `Pay $${paymentDetails?.amount.toFixed(2) || '0.00'}`
          )}
        </button>

      
        

 
        {message && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{message}</p>
          </div>
        )}

      
      
      </form>
    </div>
  );
}