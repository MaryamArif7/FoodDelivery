"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Calendar,
  User,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";

const Links = [
  { href: "/", name: "Home", icon: Home },
  { href: "/resturants", name: "Resturants", icon: Store },
  { href: "/cart", name: "Cart", icon: ShoppingCart },
  { href: "/meal-planner", name: "Meal Planner", icon: Calendar },
];

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            {Links.map((link) => (
              <LinkNav
                key={link.href}
                href={link.href}
                icon={link.icon}
                name={link.name}
                pathname={pathname}
              />
            ))}
            
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
            {Links.map((link) => (
              <LinkNav
                key={link.href}
                href={link.href}
                icon={link.icon}
                name={link.name}
                pathname={pathname}
                mobile
                onClose={() => setIsMenuOpen(false)}
              />
            ))}

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

const LinkNav = ({ href, icon: Icon, name, pathname, mobile, onClose }) => {
  const isActive = pathname === href;
  
  const handleClick = () => {
    if (onClose) onClose();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center ${
        mobile ? "gap-3 px-4 py-3 rounded-lg" : "gap-2 px-4 py-2 rounded-full"
      } transition-all duration-200 ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{name}</span>
    </Link>
  );
};