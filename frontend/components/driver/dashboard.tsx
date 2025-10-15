
'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Sidebar } from "../driver/Sidebar";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
export const Dashboard = () => {
   const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.emit("identify", "driver"); // identify role
    socket.on("order:status-updated", (update) => {
      if (update.status === "prepared") {
        // New prepared order available for drivers
        setOrders((prev) => [...prev, update]);
      }
    });

    return () => {
      socket.off("order:status-updated");
    };
  }, []);
  

  return (
    <Sidebar>
     <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Orders</h2>
      {orders.length === 0 ? (
        <p>No new orders yet...</p>
      ) : (
        orders.map((order) => (
          <div key={order.orderId} className="border p-4 rounded mb-2">
            <p><strong>Status:</strong> {order.status}</p>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
              Accept Order
            </button>
          </div>
        ))
      )}
    </div>
    
    </Sidebar>
  );
};

