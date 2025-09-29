"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, Store, Calendar, User } from "lucide-react";

export const Nav = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="top-0 z-50  backdrop-blur-md  ">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo3.png"
              alt="Company Logo"
              className="w-32 h-32 object-contain"
            />
          </Link>

          <div className="flex items-center gap-2">

            <Link
              href="/"
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-2 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Restaurants */}
            <Link
              href="/restaurants"
              onClick={() => setActiveTab("restaurants")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "restaurants"
                  ? "bg-2 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="font-medium">Restaurants</span>
            </Link>

            {/* Meal Planner */}
            <Link
              href="/meal-planner"
              onClick={() => setActiveTab("meal")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "meal"
                  ? "bg-2 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Meal Planner</span>
            </Link>

         
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-5 py-2 bg-2 text-white font-medium rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};