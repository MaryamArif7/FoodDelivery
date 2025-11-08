"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "@/lib/features/cartSlice";
import { ShoppingBag, Package, Home, CheckCircle,CheckCheck,CircleX } from 'lucide-react';
import { Nav } from "@/components/common/nav";
export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading");
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const paymentIntentId = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status");

    if (redirectStatus === "succeeded" || paymentIntentId) {
      const storedOrderId = localStorage.getItem("order_id");

      if (storedOrderId) {
        setOrderId(storedOrderId);
        updateOrderStatus(storedOrderId, paymentIntentId);
      } else {
        setStatus("success");
      }

      localStorage.removeItem("payment_client_secret");
      localStorage.removeItem("order_id");
      localStorage.removeItem("delivery_address");
      localStorage.removeItem("payment_details");
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  const updateOrderStatus = async (orderId, paymentIntentId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/update-payment-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            paymentIntentId: paymentIntentId,
            paymentStatus: "paid",
            orderStatus: "confirmed",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setOrderDetails(data.data);
      } else {
        setStatus("success");
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      setStatus("success");
    }
  };

  if (status === "loading") {
    return (
      <div>
        <Nav />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">
              Confirming your payment...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please wait, do not close this page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <div className="pt-10 bg-gray-50 flex items-center justify-center">
        <div className="max-w-xl w-full">
          {status === "success" ? (
            <div className="bg-white rounded-2xl shadow-xl p-4 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
             <CheckCheck />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-600 mb-2">Thank you for your order</p>
              <p className="text-sm text-gray-500 mb-8">
                Your payment has been processed successfully
              </p>

              <div className="space-y-2">
                <Link
                  href={`/track-order/${orderId}`}
                  className="block w-full border-2 border-red-100 bg-2 text-white py-3 rounded-xl
                         font-semibold  transition-colors duration-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Package className="w-5 h-5" />
                    <span>Track Your Order</span>
                  </div>
                </Link>

                <Link
                  href="/"
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3.5 rounded-2xl
                         font-medium transition-all duration-200 shadow-sm hover:shadow
                         border border-gray-200"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Home className="w-5 h-5" />
                    <span>Continue Shopping</span>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <CircleX />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Payment Failed
              </h1>
              <p className="text-gray-600 mb-8">
                There was an issue processing your payment. Please try again.
              </p>

              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="block w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold
                        transition-colors duration-200"
                >
                  Return to Cart
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
