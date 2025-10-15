"use client";
import { Button } from "@/components/ui/button";

export default function OrderCard({ order, onAccept, onUpdateStatus }: any) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full mb-3">
      <h2 className="text-lg font-semibold">{order?.restaurantName}</h2>
      <p className="text-gray-600 text-sm">Items: {order.items?.length}</p>
      <p className="text-gray-500 text-sm mb-2">Status: {order.deliveryStatus}</p>

      {order.deliveryStatus === "prepared" && (
        <Button onClick={() => onAccept(order._id)}>Accept Order</Button>
      )}

      {order.deliveryStatus === "on_the_way" && (
        <Button onClick={() => onUpdateStatus(order._id, "delivered")}>
          Mark as Delivered
        </Button>
      )}
    </div>
  );
}
