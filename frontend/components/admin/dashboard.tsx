"use client";

import { Sidebar } from "../admin/Sidebar";
import { useState,useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import axios from 'axios';
import { LayoutDashboard, Utensils, Truck, Users } from "lucide-react";
export const Dashboard = () => {
  const [totalCount,setTotalCount]=useState();
  
  useEffect(()=>{
    const fetchStats=async()=>{
     const response=await axios.get("http://localhost:5000/api/admin/stats");
     setTotalCount(response.data.data);
     console.log(totalCount);
  }
  fetchStats();
    },[])
   

  
 
  return (
    <Sidebar>
      <div>
       <h1 className="text-4xl ">Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-5 mt-10">
         <DashboardCard title="Total Users" count={totalCount?.Users} icon={ Users}/>
        <DashboardCard title="Total Resturants" count={totalCount?.Resturants} icon={ Utensils} />
          <DashboardCard title="Total Drivers" count={totalCount?.Drivers}  icon={ Truck}/>
      </div>
      </div>
    
    </Sidebar>
  );
};

