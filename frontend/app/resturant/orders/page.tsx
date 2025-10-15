

'use client';
import { Sidebar } from "../../../components/resturant/sidebar";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000');
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const restaurantId = 'resto_123'; // Replace with logged-in restaurant ID

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/restaurant/${restaurantId}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    };
    fetchOrders();
  }, [restaurantId]);

  // Listen for new orders in real time
  useEffect(() => {
    socket.on('order:new', (order) => {
      if (order.restaurantId === restaurantId) {
        setOrders((prev) => [order, ...prev]);
      }
    });

    socket.on('order:update', (updatedOrder) => {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off('order:new');
      socket.off('order:update');
    };
  }, []);

  // Handle status update
  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.success) {
      // Local update will be handled automatically by socket event
    }
  };
  return (
    <Sidebar>
     <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Incoming Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order._id} className="p-4 bg-white rounded-lg shadow">
              <h2 className="font-bold text-xl mb-2">Order #{order._id}</h2>
              <p className="text-gray-600 mb-2">Status: <strong>{order.status}</strong></p>
              <p className="text-gray-600 mb-2">Customer: {order.shippingDetails?.name}</p>

              <div className="flex gap-2 mt-3">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'accepted')}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                )}

                {order.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange(order._id, 'prepared')}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Mark Prepared
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </Sidebar>
  );
}
