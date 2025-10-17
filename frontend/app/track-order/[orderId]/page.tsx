'use client';

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { Nav } from '@/components/common/nav';
export default function TrackOrderPage({ 
  params 
}: { 
  params: { orderId: string } 
})  {
  const searchParams = useSearchParams();
  const { orderId } = params;
  const [status, setStatus] = useState("Loading...");
  const [socketConnected, setSocketConnected] = useState(false);

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

    // 2️⃣ Connect to WebSocket
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      setSocketConnected(true);
      // Join the specific order room (if implemented in backend)
      socket.emit("join-order-room", orderId);
    });

    // 3️⃣ Listen for real-time updates
    socket.on("order:driver-assigned", (order) => {
      if (order._id === orderId) {
        setStatus("Driver assigned (On the way 🚗)");
      }
    });

    socket.on("order:status-updated", (update) => {
      if (update.orderId === orderId) {
        setStatus(update.status);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected from server");
      setSocketConnected(false);
    });

    return () => socket.disconnect();
  }, [orderId]);

  return (
    <div>

   <Nav />
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
       
      <h1 className="text-3xl font-bold mb-4">Order Tracking</h1>
      <p className="text-gray-600 mb-2">
        Order ID: <span className="font-mono text-blue-600">{orderId}</span>
      </p>
      <p className="text-lg font-semibold text-gray-800">
        Current Status: <span className="text-blue-700">{status}</span>
      </p>
      {!socketConnected && (
        <p className="mt-4 text-sm text-red-500">
          Connecting to live updates...
        </p>
      )}
    </div>
     </div>
  );
}
