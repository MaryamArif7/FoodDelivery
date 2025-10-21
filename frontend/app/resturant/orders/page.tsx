

'use client';
import { Sidebar } from "../../../components/resturant/sidebar";
import { useEffect, useState,useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import io from 'socket.io-client';
import { Bell, Package, Clock, CheckCircle } from 'lucide-react';


const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');
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

   
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    
      socketRef.current.emit('identify', {
        userType: 'restaurant',
        userId: restaurantId
      });
    });
 const socket = socketRef.current;
    socket.on('order:new', (data) => {
      console.log('New order received:', data);
      if (data.success && data.order) {
        setOrders(prev => [data.order, ...prev]);
        showNotification(`New order from ${data.order.fullName}!`, 'success');
        playNotificationSound();
      }
    });

    
    socket.on('order:picked-up', (data) => {
      console.log(' Order picked up:', data);
      if (data.success) {
        setOrders(prev =>
          prev.map(order =>
            order.orderId === data.orderId
              ? { ...order, orderStatus: 'picked_up' }
              : order
          )
        );
        showNotification('Order picked up by driver', 'info');
      }
    });

 
   return () => {
      if (socketRef.current) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('order:new');
        socket.off('order:picked-up');
        socketRef.current.disconnect();
      }
    };
  }, []);
 const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/orders/restaurant/${restaurantId}?orderStatus=confirmed,accepted,preparing,ready`
      );
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderStatus: newStatus,
            restaurantId
          })
        }
      );

      const data = await response.json();
      
      if (data.success) {
      
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId
              ? { ...order, orderStatus: newStatus }
              : order
          )
        );
        
        showNotification('Order status updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      showNotification('Failed to update order', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      picked_up: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100';
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      confirmed: 'accepted',
      accepted: 'preparing',
      preparing: 'ready',
      ready: null
    };
    return flow[currentStatus];
  };

  const getNextStatusLabel = (currentStatus) => {
    const labels = {
      confirmed: 'Accept Order',
      accepted: 'Start Preparing',
      preparing: 'Mark as Ready',
      ready: 'Waiting for Driver'
    };
    return labels[currentStatus] || 'Update';
  };

  return (
    <Sidebar>
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Notification Sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" />
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } text-white animate-slide-in`}>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Dashboard</h1>
        <p className="text-gray-600">Manage your restaurant orders in real-time</p>
      </div>

      {/* Orders Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No active orders</p>
            <p className="text-gray-400 text-sm mt-2">New orders will appear here automatically</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  
                  <p className="text-sm text-gray-600">{order.deliveryAddress?.fullName}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.orderStatus.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Order Items */}
              <div className="mb-4 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900 font-medium">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-xl font-bold text-gray-900">${order.totalAmount}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>

              {/* Actions */}
              {getNextStatus(order.orderStatus) && (
                <button
                  onClick={() => updateOrderStatus(order._id, getNextStatus(order.orderStatus))}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as {getNextStatus(order.orderStatus).replace('_', ' ')}
                </button>
              )}

              {order.orderStatus === 'ready' && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Waiting for driver pickup...
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
    </Sidebar>
  );
}
