"use client";
import { Sidebar } from "../../../components/resturant/sidebar";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { Bell, Package, Clock, CheckCircle,CheckCheck } from "lucide-react";

const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const restaurantId = user?.id;
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  useEffect(() => {
    fetchOrders();

    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket");

      socketRef.current.emit("identify", {
        userType: "restaurant",
        userId: restaurantId,
      });
    });
    const socket = socketRef.current;
    socket.on("order:new", (data) => {
      console.log("New order received:", data);
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        showNotification(`New order from ${data.order.fullName}!`, "success");
        playNotificationSound();
      }
    });

    socket.on("order:picked-up", (data) => {
      console.log(" Order picked up:", data);
      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === data.orderId
              ? { ...order, orderStatus: "picked_up" }
              : order
          )
        );
        showNotification("Order picked up by driver", "info");
      }
    });
    socket.on("order:status-updated", (data) => {
      console.log(" Status updated:", data);

      if (data.success && data.orderId === orderId) {
        setStatus(data.orderStatus);
        if (data.order) {
          setOrder((prev) => ({ ...prev, ...data.order }));
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("order:new");
        socket.off("order:picked-up");
        socketRef.current.disconnect();
      }
    };
  }, []);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/orders/restaurant/${restaurantId}?orderStatus=confirmed,accepted,preparing,ready,on_the_way,delivered`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log("from the updateorderstatus function ",orderId);
      console.log("from the updateorderstatus function ",newStatus);
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderStatus: newStatus,
            restaurantId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );

        showNotification("Order status updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("Failed to update order", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-yellow-200 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      picked_up: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100";
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      confirmed: "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: null,
    };
    return flow[currentStatus];
  };
  console.log(orders);
  const incomingOrders = orders.filter((o) =>
    ["confirmed", "accepted", "preparing","ready"].includes(o.orderStatus)
  );
  const completedOrders = orders.filter((o) =>
    ["delivered"].includes(o.orderStatus)
  );
    console.log("incoming",incomingOrders);
  return (
  <Sidebar>
    <div className="min-h-screen p-6">
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
      />

      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          } text-white animate-slide-in`}
        >
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Orders Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your restaurant orders in real-time
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No active orders</p>
            <p className="text-gray-400 text-sm mt-2">
              New orders will appear here automatically
            </p>
          </div>
        </div>
      ) : (
        <>
        
          <div className="max-w-xl max-h-96 mx-auto mb-8  overflow-y-auto">
            <div className="bg-1 px-6 py-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-3 h-3" />
                Incoming Orders
                <span className="ml-auto bg-white text-yellow-700 rounded-full px-3 py-1 text-sm font-bold">
                  {incomingOrders.length}
                </span>
              </h2>
            </div>

            <div className=" ">
              {incomingOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-lg shadow-md p-4 border border-gray-400 hover:shadow-lg transition mb-3"
                >
                  <div className="p-4 max-h-96 overflow-y-auto space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          {order.deliveryAddress?.fullName}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    <div className="mb-4 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-gray-900 font-medium">
                            ${item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          ${order.totalAmount}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>

                    {getNextStatus(order.orderStatus) && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            getNextStatus(order.orderStatus)
                          )
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as{" "}
                        {getNextStatus(order.orderStatus).replace("_", " ")}
                      </button>
                    )}
                    {order.orderStatus === "ready" && (
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Waiting for driver pickup...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Orders Section */}
          <div className="max-w-7xl mx-auto mt-10">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden">
              <div className="bg-1 px-6 py-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <CheckCheck className="w-6 h-6" />
                  Completed Orders
                  <span className="ml-auto bg-white text-green-700 rounded-full px-3 py-1 text-sm font-bold">
                    {completedOrders.length}
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCheck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No completed orders yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {order.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {order.deliveryAddress?.fullName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {order.items.map((item, idx) => (
                              <div key={idx}>
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ${order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus
                                .replace("_", " ")
                                .toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  </Sidebar>
  );
}
