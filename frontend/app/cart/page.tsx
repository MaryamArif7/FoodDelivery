"use client"
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Nav } from "./../../components/common/nav";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateCartQuantity, deleteCartItems, fetchCartItems } from '@/lib/features/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user]);

  
  const totalAmount = cartItems?.reduce(
    (amount, item) => item.price * item.quantity + amount,
    0
  ) || 0;
  
  const deliveryFee = 3.00;
  const taxRate = 0.03;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + deliveryFee + taxAmount;
  
  const totalItems = cartItems?.length || 0;

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    
    dispatch(updateCartQuantity({
      id: user?.id,
      menuId: item.menuId._id,
      quantity: newQuantity
    })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart updated");
      } else {
        toast.error("Failed to update cart");
      }
    });
  };

  const handleRemove = (menuId) => {
    dispatch(deleteCartItems({
      id: user?.id,
      menuId: menuId
    })).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item removed from cart");
        setOpenModal(null);
      } else {
        toast.error("Failed to remove item");
      }
    });
  };

  // Handle checkout - create payment intent
  const handleCheckout = async () => {
    if (!user?.id) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }

    if (cartItems?.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckoutLoading(true);

    try {
      // Prepare product details for backend
      const productDetails = {
        items: cartItems?.map(item => ({
          name: item.menuId?.name,
          quantity: item.quantity,
          price: item.price,
          restaurant: item.restaurantId?.name
        })),
        subtotal: totalAmount,
        deliveryFee: deliveryFee,
        tax: taxAmount,
        total: finalTotal
      };

      // Call your backend API to create payment intent
      const response = await fetch('http://localhost:5000/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: finalTotal, // Total amount in dollars
          currency: 'usd',
          userId: user?.id,
          productDetails: productDetails,
          customerEmail: user?.email || null
        }),
      });

      const data = await response.json();

      if (data.success && data.data.clientSecret) {
        // Store client secret and payment details in localStorage
        localStorage.setItem('payment_client_secret', data.data.clientSecret);
        localStorage.setItem('payment_details', JSON.stringify({
          amount: finalTotal,
          paymentId: data.data.paymentId,
          items: cartItems?.length,
        }));

        // Navigate to checkout page
        router.push('/checkout');
        toast.success("Redirecting to checkout...");
      } else {
        toast.error(data.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : cartItems?.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">Your cart is empty</p>
                  <Link
                    href="/"
                    className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <li key={item.menuId} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex gap-4">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={item.image || '/placeholder-food.jpg'}
                            alt={item.menuId.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.menuId?.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.restaurantId?.name || 'Restaurant'}
                                </p>
                              </div>
                              <p className="text-lg font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="px-4 font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 rounded-r-lg transition"
                              >
                                <Plus className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>

                            <button
                              onClick={() => setOpenModal(item.menuId._id)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (3%)</span>
                  <span className="font-medium">${taxAmount.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading || cartItems?.length === 0}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Remove Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(openModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}