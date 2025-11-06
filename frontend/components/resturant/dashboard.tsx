"use client";

import { Sidebar } from "../resturant/Sidebar";
import { useState, useEffect } from "react";
import { DashboardCard } from "./DashboardCard";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@/app/hooks/useAuth";
import axios from "axios";
import { LayoutDashboard, Utensils, Truck, Users } from "lucide-react";
export const Dashboard = () => {
  const [totalCount, setTotalCount] = useState();
  const { user } = useSelector((state) => state.auth);
  const resId = user?.id;
  useEffect(() => {
    const fetchStats = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/resturant/stats/${resId}`
      );
      setTotalCount(response.data.data);
      console.log(totalCount);
    };
    fetchStats();
  }, []);

  return (
    <Sidebar>
      <div>
        <h1 className="text-4xl ">Dashboard</h1>
        <div className="grid lg:grid-cols-3 gap-5 mt-10">
          <DashboardCard
            title="Total orders"
            count={totalCount?.Orders}
            icon={Users}
          />
        </div>
      </div>
    </Sidebar>
  );
};
