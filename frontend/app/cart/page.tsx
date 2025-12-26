"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "./../../components/common/nav";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import {
  updateCartQuantity,
  deleteCartItems,
  fetchCartItems,
} from "@/lib/features/cartSlice";
export default function Cart() {
  const dispatch = useDispatch();
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const [openModal, setOpenModal] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [customerLocation, setCustomerLocation] = useState({lat:null,lang:null});
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    deliveryInstructions: "",
  });
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    }
  }, [dispatch, user]);
  const totalAmount =
    cartItems?.reduce(
      (amount, item) => item.price * item.quantity + amount,
      0
    ) || 0;

  const deliveryFee = 3.0;
  const taxRate = 0.03;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + deliveryFee + taxAmount;
  const totalItems = cartItems?.length || 0;
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(
      updateCartQuantity({
        id: user?.id,
        menuId: item.menuId._id,
        quantity: newQuantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Cart updated");
      } else {
        toast.error("Failed to update cart");
      }
    });
  };
  const handleRemove = (menuId) => {
    dispatch(
      deleteCartItems({
        id: user?.id,
        menuId: menuId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success("Item removed from cart");
        setOpenModal(null);
      } else {
        toast.error("Failed to remove item");
      }
    });
  };
  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    if (!address.fullName.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!address.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!address.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!address.street.trim()) {
      toast.error("Please enter your street address");
      return false;
    }
    if (!address.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!address.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!address.zipCode.trim()) {
      toast.error("Please enter your zip code");
      return false;
    }
    return true;
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
         toast.success("Location captured!");
        },
        (error) => {
          console.error("Error getting location:", error);
         toast.error("Please enable location services");
        }
      );
    }
  };
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
    setShowAddressModal(true);
  };
  const handleProceedToPayment = async () => {
    if (!validateAddress()) return;
    setCheckoutLoading(true);
    getCurrentLocation();
    try {
      const orderData = {
        userId: user?.id,
        items: cartItems?.map((item) => ({
          menuId: item.menuId._id,
          name: item.menuId?.name,
          quantity: item.quantity,
          price: item.price,
          restaurantId: item.restaurantId?._id,
          restaurantName: item.restaurantId?.name,
          image: item.image,
        })),
        deliveryAddress: address,
        customerLocation: customerLocation,
        subtotal: totalAmount,
        deliveryFee: deliveryFee,
        tax: taxAmount,
        totalAmount: finalTotal,
        paymentStatus: "pending",
        orderStatus: "pending",
      };

      const orderResponse = await fetch(
        "http://localhost:5000/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );
      const orderResult = await orderResponse.json();
      if (!orderResult.success) {
        toast.error("Failed to create order");
        setCheckoutLoading(false);
        return;
      }
      const orderId = orderResult.data._id || orderResult.data.orderId;
      const paymentResponse = await fetch(
        "http://localhost:5000/api/payment/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: finalTotal,
            currency: "usd",
            userId: user?.id,
            orderId: orderId,
            productDetails: {
              orderId: orderId,
              items: cartItems?.length,
              deliveryAddress: address,
            },
            customerEmail: address.email,
          }),
        }
      );
      const paymentData = await paymentResponse.json();
      if (paymentData.success && paymentData.data.clientSecret) {
        localStorage.setItem(
          "payment_client_secret",
          paymentData.data.clientSecret
        );
        localStorage.setItem("order_id", orderId);
        localStorage.setItem("delivery_address", JSON.stringify(address));
        localStorage.setItem(
          "payment_details",
          JSON.stringify({
            amount: finalTotal,
            items: cartItems?.length,
            orderId: orderId,
          })
        );
        setShowAddressModal(false);
        router.push("/checkout");
        toast.success("Proceeding to payment...");
      } else {
        toast.error(paymentData.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to proceed to checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen  ">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className=" text-xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{totalItems} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    className="mt-4 inline-block primary-text hover:text-indigo-700 font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {cartItems?.map((item) => (
                    <li
                      key={item.menuId}
                      className="p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex gap-2 md:gap-2 lg:gap-4">
                        <div className="h-20 w-20 md:h-24 md:w-24 lg:h-24 lg:w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                          <img
                            src={item.image || "/placeholder-food.jpg"}
                            alt={item.menuId.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-sm md:text-base lg:text-lg  font-semibold text-gray-900">
                                  {item.menuId?.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.restaurantId?.name || "Restaurant"}
                                </p>
                              </div>
                              <p className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center  gap-1 md:gap-1 lg:gap-3 border border-gray-300 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity - 1)
                                }
                                className="p-2 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="px-4 font-medium text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item, item.quantity + 1)
                                }
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
              className="mt-4 inline-flex items-center gap-2 primary-text font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
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
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md md:max-w-lg lg:max-w-xl p-4 md:p-6 my-8">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
              Delivery Address
            </h3>
            <form className="space-y-1 md:space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="Maryam"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="+923123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={address.email}
                  onChange={handleAddressChange}
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="maryam@example.com"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="Sialkot"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="Punjab"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  name="deliveryInstructions"
                  value={address.deliveryInstructions}
                  onChange={handleAddressChange}
                  rows="3"
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg  focus:ring-red-500 focus:border-red-500 transition resize-none"
                  placeholder="Leave at door, ring bell, etc."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-full sm:flex-1 px-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={checkoutLoading}
                  className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 md:py-3 text-sm md:text-base rounded-lg font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {checkoutLoading ? "Processing..." : "Continue to Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Remove Item
            </h3>
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
