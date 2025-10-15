'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setStatus('success');
      setPaymentIntent(paymentIntentId);
      
      // Create order after successful payment
      createOrder(paymentIntentId);
      
      // Clear stored data
      localStorage.removeItem('payment_client_secret');
      localStorage.removeItem('payment_id');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const createOrder = async (paymentIntentId) => {
    try {
      // Call your backend to create order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          userId: localStorage.getItem('userId') || 'guest', // Get from your auth system
          shippingDetails: {
            // Get from form or user profile
            name: 'John Doe',
            email: 'john@example.com',
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA',
            },
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setOrderId(data.data.orderId);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'success' ? (
          <>
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
            <p className="text-sm text-gray-500 mb-6">Your order has been confirmed and is being processed.</p>
            
            {/* Order Details */}
            {orderId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 font-semibold mb-1">Order ID</p>
                <p className="text-lg font-mono text-blue-900">{orderId}</p>
              </div>
            )}

            {/* Payment Intent (Secondary Info) */}
            {paymentIntent && !orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500">Payment ID:</p>
                <p className="text-sm font-mono text-gray-700 break-all">{paymentIntent}</p>
              </div>
            )}

            {/* Call to Actions */}
            <div className="space-y-3">
              {/* PRIMARY CTA - Track Your Order */}
              <Link
                href={orderId ? `/track-order?orderId=${orderId}` : '/track-order'}
                className="flex items-center justify-center w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg
                         hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg 
                  className="w-6 h-6 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Track Your Order
              </Link>

              {/* SECONDARY CTA - View Receipt */}
              <Link
                href={`/order-details/${orderId || paymentIntent}`}
                className="block w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg
                         font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                View Order Details
              </Link>

              {/* TERTIARY CTAs */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/payment-history"
                  className="block w-full text-gray-600 py-2 rounded-lg
                           font-medium hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  View Payment History
                </Link>
                <Link
                  href="/"
                  className="block w-full text-gray-600 py-2 rounded-lg
                           font-medium hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start text-left text-sm text-gray-600">
                <svg 
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">What happens next?</p>
                  <ul className="space-y-1">
                    <li>• You'll receive a confirmation email shortly</li>
                    <li>• Your order will be processed within 24 hours</li>
                    <li>• Track your delivery status anytime using the button above</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Error State */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">There was an issue processing your payment.</p>
            
            <Link
              href="/"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold
                       hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}