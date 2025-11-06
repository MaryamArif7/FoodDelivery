"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import c from "classnames";
import { LayoutDashboard, Utensils, Truck, Users } from "lucide-react";
import { RefreshCw, FileText, Settings, Code, LogOut,Menu, X } from "lucide-react";

const Links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Resturants", href: "/admin/resturants", icon: Utensils },
  { name: "Drivers", href: "/admin/drivers", icon: Truck },
  { name: "Users", href: "/admin/users", icon: Users },
];


export function Sidebar({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="flex h-screen overflow-hidden">
    
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <img className="object-contain" src="/logo3.png" alt="Food Rush" />
            </div>
            <span className="text-xl font-bold text-gray-900">Food Rush</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-black/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
         
          <div className="hidden lg:flex items-center gap-3 mb-12">
            <div className="w-12 h-12">
              <img className="object-contain" src="/logo3.png" alt="Food Rush" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Food Rush</span>
          </div>

          
          <div className="lg:hidden h-4" />

          <nav className="space-y-2">
            {Links.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-black/10 text-gray-900 font-medium"
                      : "text-gray-800 hover:bg-black/5"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-black/10">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-800 hover:bg-black/5 rounded-lg transition-all duration-200">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Log out</span>
          </button>
        </div>
      </aside>

      
      <div className="flex-1 overflow-y-auto bg-white pt-16 lg:pt-0">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}