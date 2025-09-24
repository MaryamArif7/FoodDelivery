"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { cn } from "../../lib/utils";
import c from "classnames";
import { LayoutDashboard, Utensils, Truck, Users } from "lucide-react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
const Links = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Resturants", href: "/admin/resturants", icon: Utensils },
  { name: "Drivers", href: "/admin/drivers", icon: Truck },
  { name: "Users", href: "/admin/users", icon: Users },
];
const Links2 = [{ name: "Logout", href: "/" }];
export function Sidebar({ children }: { children?: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      const check = window.innerWidth <= 820;
      setIsMobile(check);
      if (check) setIsOpened(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-row-reverse h-screen  border-gray-600  ">
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <div
        className={c(
          " overflow-y-auto overflow-x-hidden rounded-r-[14px]  border-r border-gray-400",
          isMobile ? (isOpened ? "w-full" : "w-0") : isOpened ? "w-64" : "w-16"
        )}
      >
        <div className="h-screen flex flex-col  ">
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-start w-full p-3.5 md:p-4 sticky top-0 ">
              <Link href="/admin" className="flex items-center relative z-50 ">
                <div className="font-semibold">
                  <img
                    src="/small-logo.svg"
                    className="w-14 h-14"
                    alt="Food Rush"
                  />
                </div>
                {isOpened && (
                  <span className=" ml-2 text-3xl font-bold h1 ">
                    Food Rush
                  </span>
                )}
              </Link>

              <div
                className="flex items-center justify-end h-12 w-8 cursor-pointer absolute right-0 top-3"
                onClick={() => setIsOpened(!isOpened)}
              >
                {isMobile ? (
                  <button className="p-1 rounded focus:outline-none mr-10">
                    <FiX className=" font-bold w-6 h-6" />
                  </button>
                ) : isOpened ? (
                  <HiOutlineChevronDoubleLeft className=" text-black w-4 h-4 mr-4 mb-2 font-bold" />
                ) : (
                  <HiOutlineChevronDoubleRight className=" text-black w-4 h-4 font-bold" />
                )}
              </div>
            </div>
            <div className="mt-6 w-full ml-5 ">
              {Links.map(({ name, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 ${
                    pathname === href ? "bg-1 text-white" : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isOpened && <span>{name}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
