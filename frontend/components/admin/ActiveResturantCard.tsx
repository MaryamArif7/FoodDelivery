import { Trash, Store, Clock, Mail, Phone, FileText, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";

export const ActiveResturantCard = ({ name, createdAt,resturant }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 p-5 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative flex justify-between items-start">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className=" p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <img src={resturant.logo} className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-gray-800 truncate group-hover:text-emerald-700 transition-colors">{name}</h1>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <p className="text-gray-500 text-sm">{formatDate(createdAt)}</p>
            </div>
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Active</span>
            </div>
          </div>
        </div>
        
        <button className="ml-3 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100">
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
