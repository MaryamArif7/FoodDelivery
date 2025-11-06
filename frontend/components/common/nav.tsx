"use client";
import Link from "next/link";
import { useState } from "react";
import { Home, Store, Calendar, User, Menu, X , ShoppingCart} from "lucide-react";

export const Nav = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };
console.log(activeTab);
  return (
    <nav className="top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
      
          <Link href="/" className="flex-shrink-0">
            <img
              src="/logo3.png"
              alt="Company Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/"
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/resturants"
              onClick={() => setActiveTab("Resturants")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "Resturants"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="font-medium">Resturants</span>
            </Link>
          
            <Link
              href="/cart"
              onClick={() => setActiveTab("cart")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "cart"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart</span>
            </Link>
            <Link
              href="/meal-planner"
              onClick={() => setActiveTab("meal-planner")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "meal-planner"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Meal Planner</span>
            </Link>

            <Link
              href="/auth/signin"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </div>

     
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

        </div>

      
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/"
              onClick={() => handleLinkClick("home")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/resturants"
              onClick={() => handleLinkClick("resturants")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "resturants"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Store className="w-5 h-5" />
              <span className="font-medium">Resturants</span>
            </Link>
               <Link
              href="/cart"
              onClick={() => setActiveTab("cart")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                activeTab === "cart"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Cart</span>
            </Link>
            <Link
              href="/meal-planner"
              onClick={() => handleLinkClick("meal-planner")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === "meal-planner"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Meal Planner</span>
            </Link>
    
            <Link
              href="/auth/signin"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <User className="w-5 h-5" />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};