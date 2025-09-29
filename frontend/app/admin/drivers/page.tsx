"use client";
import { Sidebar } from "../../../components/admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Drivers() {
  const [allDrivers, setAllDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const Res = await axios.get(
          "http://localhost:5000/api/admin/drivers"
        );
        setAllDrivers(Res.data.data || []);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold ml-5">Manage All Drivers  Here</h1>

      <div className="min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto p-6"></div>
      </div>
    </Sidebar>
  );
}
