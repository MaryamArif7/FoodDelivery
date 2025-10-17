'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { fetchCartItems } from '@/lib/features/cartSlice';
import { Nav } from '@/components/common/nav';
export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded' || paymentIntentId) {
      // Get order ID from localStorage
      const storedOrderId = localStorage.getItem('order_id');
      
      if (storedOrderId) {
        setOrderId(storedOrderId);
        updateOrderStatus(storedOrderId, paymentIntentId);
      } else {
        setStatus('success');
      }
      
      // Clear stored data
      localStorage.removeItem('payment_client_secret');
      localStorage.removeItem('order_id');
      localStorage.removeItem('delivery_address');
      localStorage.removeItem('payment_details');
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const updateOrderStatus = async (orderId, paymentIntentId) => {
    try {
      // Update order status to "paid" and "confirmed"
      const response = await fetch(`http://localhost:5000/api/orders/update-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentIntentId: paymentIntentId,
          paymentStatus: 'paid',
          orderStatus: 'confirmed'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setOrderDetails(data.data);
        
        // Optionally: Clear the cart after successful payment
        // dispatch(clearCart());
      } else {
        setStatus('success'); // Still show success even if update fails
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setStatus('success'); // Still show success
    }
  };

  if (status === 'loading') {
    return (
      <div>
          <Nav />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Confirming your payment...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait, do not close this page</p>
        </div>
      </div>
      </div>

    );
  }

  return (
    <div>
 <Nav />
  
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       
      <div className="max-w-lg w-full">
        {status === 'success' ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
            <p className="text-gray-600 mb-2">Thank you for your order</p>
            <p className="text-sm text-gray-500 mb-8">Your payment has been processed successfully</p>
            
            {/* Order ID */}
            {orderId && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-5 mb-8">
                <p className="text-sm text-indigo-600 font-semibold mb-2">Order Number</p>
                <p className="text-2xl font-bold font-mono text-indigo-900">#{orderId.substring(0, 8).toUpperCase()}</p>
                <p className="text-xs text-indigo-600 mt-2">Save this for tracking</p>
              </div>
            )}

            {/* Primary Action */}
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg
                       hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-0.5 mb-3"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Order Details
              </div>
            </Link>

            {/* Secondary Actions */}
            <div className="space-y-2">
              <Link
                href={`/track-order/${orderId}`}
                className="block w-full border-2 border-indigo-600 text-indigo-600 py-3 rounded-xl
                         font-semibold hover:bg-indigo-50 transition-colors duration-200"
              >
                Track your order
              </Link>
              
              <Link
                href="/"
                className="block w-full text-gray-600 py-3 rounded-xl
                         font-medium hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start text-left text-sm">
                <svg className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-gray-600">
                  <p className="font-semibold text-gray-900 mb-2">What happens next?</p>
                  <ul className="space-y-1.5">
                    <li>✓ Confirmation email sent to your inbox</li>
                    <li>✓ Restaurant will start preparing your order</li>
                    <li>✓ You can track delivery status in real-time</li>
                    <li>✓ Estimated delivery: 30-45 minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>Need help? <Link href="/support" className="text-indigo-600 hover:text-indigo-700 font-medium">Contact Support</Link></p>
            </div>
          </div>
        ) : (
          /* Error State */
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-8">There was an issue processing your payment. Please try again.</p>
            
            <div className="space-y-3">
              <Link
                href="/cart"
                className="block w-full bg-indigo-600 text-white py-4 rounded-xl font-bold
                         hover:bg-indigo-700 transition-colors duration-200"
              >
                Return to Cart
              </Link>
              
              <Link
                href="/support"
                className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl
                         font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
      </div>
  );
}