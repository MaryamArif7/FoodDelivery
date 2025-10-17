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
    // Get payment details from localStorage
    const details = localStorage.getItem('payment_details');
    if (details) {
      setPaymentDetails(JSON.parse(details));
    }

    // Debug logs
    console.log('🔍 CheckoutForm Debug:');
    console.log('Stripe loaded:', !!stripe);
    console.log('Elements loaded:', !!elements);
    console.log('Payment details:', details);
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error('❌ Stripe or Elements not loaded');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log('💳 Confirming payment...');
      
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('❌ Payment error:', error);
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message);
        } else {
          setMessage('An unexpected error occurred.');
        }
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!');
        localStorage.removeItem('payment_client_secret');
        localStorage.removeItem('payment_details');
        router.push(`/payment-success?payment_intent=${paymentIntent.id}`);
      }
    } catch (err) {
      console.error('💥 Payment error:', err);
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
      {/* Debug Info - REMOVE THIS AFTER TESTING */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
        <p className="font-semibold mb-2">🔍 Debug Info:</p>
        <div className="space-y-1">
          <p>Stripe loaded: {stripe ? '✅ Yes' : '❌ No'}</p>
          <p>Elements loaded: {elements ? '✅ Yes' : '❌ No'}</p>
          <p>Loading state: {isLoading ? 'Yes' : 'No'}</p>
          <p>Button disabled: {buttonDisabled ? '❌ Yes' : '✅ No'}</p>
          <p>Payment details: {paymentDetails ? '✅ Found' : '❌ Missing'}</p>
        </div>
      </div>

      {/* Order Summary */}
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
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold 
                     hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
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

        {/* Show why button is disabled */}
        {buttonDisabled && !isLoading && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
            <p className="text-yellow-800">
              ⚠️ Button is disabled because:
              {!stripe && <span className="block">• Stripe hasn't loaded yet</span>}
              {!elements && <span className="block">• Payment form hasn't loaded yet</span>}
            </p>
          </div>
        )}

        {/* Show error message */}
        {message && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{message}</p>
          </div>
        )}

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secured by Stripe</span>
        </div>
      </form>
    </div>
  );
}