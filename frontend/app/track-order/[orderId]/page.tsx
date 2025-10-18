'use client';

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Nav } from '@/components/common/nav';
import { Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';
export default function TrackOrderPage({ 
  params 
}: { 
  params: { orderId: string } 
})  {
  const searchParams = useSearchParams();
  const { orderId } = params;
    const { user } = useSelector((state) => state.auth);
    const userId = user?.id;
  const [status, setStatus] = useState("Loading...");
  const [socketConnected, setSocketConnected] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
   const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const socketRef = useRef<any>(null);


  useEffect(() => {
    if (!orderId) return;

    // 1️⃣ Fetch current order status initially
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/${orderId}`
        );
        const data = await res.json();
        setStatus(data?.data?.orderStatus || "Pending");
      } catch (err) {
        console.error("Error fetching order:", err);
        setStatus("Error loading order");
      }
    };
    fetchStatus();

    socketRef.current = io("http://localhost:5000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      setSocketConnected(true);
      
      // Identify as customer
      socket.emit("identify", {
        userType: "user",
        userId: userId
      });
    });

  socket.on("order:created", (data) => {
      console.log("📦 Order created:", data);
      
      if (data.success && data.order && data.order.orderId === orderId) {
        setOrder(data.order);
        setStatus(data.order.orderStatus);
      }
    });

    // FIXED: Match your backend structure
    socket.on("order:status-updated", (data) => {
      console.log("🔄 Status updated:", data);
      
      if (data.success && data.orderId === orderId) {
        setStatus(data.orderStatus);
        if (data.order) {
          setOrder(prev => ({ ...prev, ...data.order }));
        }
      }
    });

    socket.on("order:driver-assigned", (data) => {
      console.log("🚗 Driver assigned:", data);
      
      if (data.success && data.orderId === orderId) {
        setOrder(prev => ({ 
          ...prev, 
          driverId: data.driver,
          orderStatus: 'picked_up'
        }));
        setStatus('picked_up');
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected");
      setSocketConnected(false);
    });

    socket.on("reconnect", () => {
      console.log("🔄 Reconnected");
      setSocketConnected(true);
      socket.emit("identify", {
        userType: "user",
        userId: userId
      });
    });

    return () => {
      if (socketRef.current) {
        socket.off("connect");
        socket.off("order:created");
        socket.off("order:status-updated");
        socket.off("order:driver-assigned");
        socket.off("disconnect");
        socket.off("reconnect");
        socketRef.current.disconnect();
      }
    };
  }, [orderId]);
 const getStatusInfo = (currentStatus: string) => {
    const statusMap: Record<string, {
      label: string;
      icon: any;
      color: string;
      description: string;
    }> = {
      pending: {
        label: "Order Placed",
        icon: Clock,
        color: "text-yellow-600 bg-yellow-50",
        description: "Waiting for restaurant confirmation"
      },
      accepted: {
        label: "Order Accepted",
        icon: CheckCircle,
        color: "text-blue-600 bg-blue-50",
        description: "Restaurant is preparing your order"
      },
      preparing: {
        label: "Being Prepared",
        icon: Package,
        color: "text-purple-600 bg-purple-50",
        description: "Your food is being cooked"
      },
      ready: {
        label: "Ready for Pickup",
        icon: Package,
        color: "text-green-600 bg-green-50",
        description: "Waiting for driver to pick up"
      },
      picked_up: {
        label: "Out for Delivery",
        icon: Truck,
        color: "text-orange-600 bg-orange-50",
        description: "Driver is on the way to you"
      },
      delivered: {
        label: "Delivered",
        icon: CheckCircle,
        color: "text-green-600 bg-green-50",
        description: "Order delivered successfully!"
      }
    };

    return statusMap[currentStatus] || statusMap.pending;
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  // Calculate progress percentage
  const getProgressPercentage = (currentStatus: string) => {
    const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };
  return (
    <div>

   <Nav />
     <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Connection Status */}
          {!socketConnected && (
            <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-2">
              <div className="animate-pulse w-2 h-2 bg-orange-500 rounded-full"></div>
              <p className="text-sm text-orange-700">Connecting to live updates...</p>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
            <p className="text-gray-600">
              Order ID: <span className="font-mono text-blue-600">#{orderId.slice(-8).toUpperCase()}</span>
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className={`flex items-center gap-4 p-4 rounded-lg ${statusInfo.color}`}>
              <StatusIcon className="w-12 h-12" />
              <div>
                <h2 className="text-xl font-bold">{statusInfo.label}</h2>
                <p className="text-sm mt-1">{statusInfo.description}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage(status)}%` }}
                ></div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mt-6 space-y-3">
              {['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered'].map((s) => {
                const info = getStatusInfo(s);
                const Icon = info.icon;
                const statusOrder = ['pending', 'accepted', 'preparing', 'ready', 'picked_up', 'delivered'];
                const isCompleted = statusOrder.indexOf(status) >= statusOrder.indexOf(s);
                
                return (
                  <div key={s} className={`flex items-center gap-3 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

         
          {/* Order Details */}
          {order && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-4">Order Details</h3>
              <div className="space-y-3">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold">${item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
     </div>
  );
}
