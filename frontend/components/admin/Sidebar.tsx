"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import c from "classnames";
import { LayoutDashboard, Utensils, Truck, Users } from "lucide-react";
import { RefreshCw, FileText, Settings, Code, LogOut } from "lucide-react";

const Links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Resturants", href: "/admin/resturants", icon: Utensils },
  { name: "Drivers", href: "/admin/drivers", icon: Truck },
  { name: "Users", href: "/admin/users", icon: Users },
];

export function Sidebar({ children }: { children?: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex flex-col justify-between shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12">
              <img className="object-contain" src="/logo3.png" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Food Rush</span>
          </div>

          <nav className="space-y-2">
            {Links.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
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
      </div>

     
      <div className="flex-1 overflow-y-auto bg-white">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
