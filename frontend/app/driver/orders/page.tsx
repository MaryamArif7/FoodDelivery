"use client";

import { useEffect, useState } from "react";
import OrderCard from "./components/OrderCard";
import { useSocket } from "./hooks/useSocket";

import { Sidebar } from "../../../components/driver/sidebar";
export default function Orders() {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  // fetch available and active orders
  const fetchOrders = async () => {
    const res = await fetch("/api/driver/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAvailableOrders(data);
  };

  const fetchActiveOrders = async () => {
    const res = await fetch("/api/driver/orders?status=on_the_way", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setActiveOrders(data);
  };

  // Accept order
  const handleAcceptOrder = async (id: string) => {
    const res = await fetch(`/api/driver/orders/${id}/accept`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await fetchOrders();
      await fetchActiveOrders();
    }
  };

  // Update order status
  const handleUpdateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/driver/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) await fetchActiveOrders();
  };

  // WebSocket
  useSocket((event, data) => {
    if (event === "order:status-updated" && data.deliveryStatus === "prepared") {
      // New prepared order appears
      setAvailableOrders((prev) => [data, ...prev]);
    }
  });

  useEffect(() => {
    fetchOrders();
    fetchActiveOrders();
  }, []);
  return (
    <Sidebar>
      <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Available Orders</h2>
        {availableOrders.length > 0 ? (
          availableOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onAccept={handleAcceptOrder}
            />
          ))
        ) : (
          <p className="text-gray-500">No available orders right now.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Active Deliveries</h2>
        {activeOrders.length > 0 ? (
          activeOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))
        ) : (
          <p className="text-gray-500">No active deliveries currently.</p>
        )}
      </section>
    </div>
    </Sidebar>
  );
}
