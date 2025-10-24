
'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Sidebar } from "../driver/Sidebar";

const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
export const Dashboard = () => {
   const [orders, setOrders] = useState([]);


  

  return (
    <Sidebar>
     <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Orders</h2>
    
    
    </div>
    
    </Sidebar>
  );
};

