"use client";
import io from "socket.io-client"
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Sidebar } from "../../components/driver/sidebar";

export default function Driver() {
  const { user } = useSelector((state) => state.auth);
  console.log("Driver user:", user);
  const driverId = user?.id;
  const socketRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('available');
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const locationWatchId = useRef(null);

  useEffect(() => {
    if (!driverId) return;

    socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log("🔌 Connected to WebSocket:", socket.id);
      
      socket.emit('identify', {
        userType: 'driver',
        userId: driverId
      });
    });

    // Fixed: Match the actual data structure from backend
    socket.on("new order for pick-up", (data) => {
      console.log("📬 New order received:", data);
      console.log("Data structure:", JSON.stringify(data, null, 2));
      
      // Backend sends: { orderId, restaurantName, deliveryAddress }
      setOrders(prev => [{
        id: data.orderId,
        restaurantName: data.restaurantName,
        deliveryAddress: data.deliveryAddress,
      }, ...prev]);
      
      toast.success(`New order from ${data.restaurantName}`);
    });

    // Start location tracking
    if (navigator.geolocation) {
      locationWatchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Send location for ALL accepted orders
          acceptedOrders.forEach(order => {
            if (order.orderStatus !== 'delivered') {
              socket.emit('updateDriverLocation', {
                orderId: order.id,
                lat: latitude,
                lng: longitude,
                driverId: driverId
              });
              console.log(`📍 Location sent for order ${order.id}:`, latitude, longitude);
            }
          });
        },
        (error) => {
          console.error('❌ Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    return () => {
      console.log("🔌 Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('new order for pick-up');
        socketRef.current.disconnect();
      }
      if (locationWatchId.current) {
        navigator.geolocation.clearWatch(locationWatchId.current);
      }
    }
  }, [driverId, acceptedOrders]); // Add acceptedOrders to dependency

  const changeAvailability = async (newStatus) => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/orders/driver/availability`, { 
        driverId, 
        status: newStatus 
      });
      setStatus(res.data.status);
      toast.success(`Availability changed to ${newStatus}`);
    } catch (error) {
      console.error("Availability error:", error);
      toast.error("Failed to change availability");
    } finally {
      setLoading(false);
    }
  }

  const assignDriver = async (order, orderId) => {
    console.log("Assigning driver to order:", orderId);
    try {
      const res = await axios.post(`http://localhost:5000/api/orders/driver/assign`, {
        orderId,
        driverId
      });
      
      console.log("Assignment response:", res.data);
      
      if (res.data.success) {
        // Remove from pending orders
        setOrders(prev => prev.filter(o => o.id !== orderId));
        
        // Add to accepted orders
        setAcceptedOrders(prev => [...prev, {
          ...order,
          id: orderId, // Ensure ID is set
          orderStatus: 'accepted'
        }]);
        
        toast.success('Order accepted successfully');
      }
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error("Failed to accept order");
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    try {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
      const res = await axios.put(`http://localhost:5000/api/orders/driver/update/status`, {
        orderId,
        orderStatus: newStatus,
        driverId
      });

      console.log("Status update response:", res.data);

      if (res.data.success) {
        setAcceptedOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        
        if (newStatus === 'delivered') {
          toast.success('Order delivered successfully!');
          setTimeout(() => {
            setAcceptedOrders(prev => prev.filter(o => o.id !== orderId));
          }, 2000);
        } else {
          toast.success(`Order status updated to ${newStatus}`);
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  }

  const getStatusButton = (order) => {
    const { orderStatus, id } = order;
    const isUpdating = updatingStatus[id];

    switch (orderStatus) {
      case 'accepted':
        return (
          <button
            onClick={() => updateOrderStatus(id, 'on_the_way')}
            disabled={isUpdating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Start Delivery'}
          </button>
        );
      case 'on_the_way':
        return (
          <button
            onClick={() => updateOrderStatus(id, 'delivered')}
            disabled={isUpdating}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Mark as Delivered'}
          </button>
        );
      case 'delivered':
        return (
          <span className="text-green-600 font-semibold">✓ Delivered</span>
        );
      default:
        return null;
    }
  }

  const getStatusBadge = (orderStatus) => {
    const statusConfig = {
      accepted: 'bg-yellow-100 text-yellow-800',
      on_the_way: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[orderStatus]}`}>
        {orderStatus.replace('_', ' ').toUpperCase()}
      </span>
    );
  }
console.log(orders);
  return (
    <Sidebar>
      <div className="min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>
        
       

        {/* Availability Toggle */}
        <div className="mb-6 flex items-center gap-4">
          <h2 className={`font-semibold ${status === 'available' ? 'text-green-500' : 'text-red-500'}`}>
            Status: {status}
          </h2>
          <button
            disabled={loading}
            onClick={() => changeAvailability(status === 'available' ? 'busy' : 'available')}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              status === 'available' ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
              status === 'available' ? 'translate-x-8' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Incoming Orders */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Incoming Orders</h2>
          <p className="text-gray-600 mb-4">Accept them if you are able to deliver</p>
          {orders.length === 0 ? (
            <p className="text-gray-500">No pending orders</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-semibold text-lg">{order.restaurantName}</h3>
                   <h3 className="font-semibold text-lg">{order.fullName}</h3>
                    <h3 className="font-semibold text-lg">{order.email}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Order ID: {order.id}</p>
                  <button
                    onClick={() => assignDriver(order, order.id)}
                    className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Accept Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Deliveries */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Active Deliveries</h2>
          {acceptedOrders.length === 0 ? (
            <p className="text-gray-500">No active deliveries</p>
          ) : (
            <div className="space-y-4">
              {acceptedOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{order.restaurantName}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                      </p>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="mt-3">
                    {getStatusButton(order)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}