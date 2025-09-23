"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import {cn } from "../../lib/utils"
import c from "classnames";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineSpeakerphone } from "react-icons/hi";
const Links = [
  { name: "Dashboard", href: "/admin" },
  { name: "Resturants", href: "/admin/resturants" },
  { name: "Drivers", href: "/admin/drivers" },
  { name: "Users", href: "/admin/users" },
];
const Links2 = [{ name: "Logout", href: "/" }];
export function Sidebar({ children }: { children?: React.ReactNode }) {
const [isMobile,setIsMobile]=useState(false);
const [isOpened,setIsOpened]=useState(false);
const router=useRouter();
const pathname=usePathname();


useEffect(()=>{
    const handleResize=()=>{
        const check=window.innerWidth<=820;
        setIsMobile(check);
        if(check)setIsOpened(false);

    };
    handleResize();
    window.addEventListener("resize",handleResize);
    return()=>window.removeEventListener("resize",handleResize);
},[]);
return(

   <div className="flex flex-row-reverse h-screen  bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 ">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="bg-background-light border-b-2 dark:border-border" setIsOpened={setIsOpened} > </div>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Sidebar */}
      <div className={c(
          " overflow-y-auto overflow-x-hidden rounded-r-[14px]  border-r border-gray-200 dark:border-gray-800",
          isMobile ? (isOpened ? 'w-full' : 'w-0') : (isOpened ? 'w-64' : 'w-16')
        )}
      >
        <div className="h-screen flex flex-col  dark:text-white">
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-start w-full p-3.5 md:p-4 sticky top-0 ">
              <Link href="/" className="flex items-center relative z-50">
                <div className="font-semibold">
                  <img src="/images/small-logo.png" className="w-8 h-8" alt="Rabbito Logo" />
                </div>
                {isOpened && (
                  <span className=" ml-5  text-xl font-bold  ">
                    Food Rush
                  </span>
                )}
              </Link>
              
              {/* Toggle button */}
              <div className="flex items-center justify-end h-12 w-8 cursor-pointer absolute right-0 top-3" onClick={() => setIsOpened(!isOpened)}>
                {isMobile ? (
                  <button className="p-1 rounded focus:outline-none mr-10">
                    <FiX className="text-secondary-txt-1 font-bold w-6 h-6" />
                  </button>
                ) : (
                  isOpened ? <HiOutlineChevronDoubleLeft className="dark:text-secondary-txt-1 text-white w-4 h-4 mr-4 mb-2 font-bold" />
                  : <HiOutlineChevronDoubleRight className="dark:text-secondary-txt-1 text-white w-4 h-4 font-bold" />
                )}
              </div>
            </div>

            {/* Top links */}
            <div className="mt-6 w-full">
              {Links.map(link => (
                <button key={link.href} href={link.href} Icon={link.icon} name={link.name} isOpened={isOpened} pathname={pathname} />
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="sticky bottom-0 ">
              {/* Bottom links */}
              {Links2.map(link => (
                <div key={link.href} className="flex items-center mb-2 cursor-pointer px-2">
                  {link.name === "logout" ? (
                    <button className="w-full group flex items-center text-sm font-medium focus:outline-none rounded-md px-4 py-2  text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200" onClick={handleLogout}>
                      <link.icon className="flex-shrink-0 -ml-1 mr-3 h-6 w-6 " />
                      {isOpened && <span className="text-red-light-txt group-hover:text-red-light-txt">{link.name}</span>}
                    </button>
                  ) : (
                    <button key={link.href} href={link.href} Icon={link.icon} name={link.name} isOpened={isOpened} pathname={pathname} />
                  )}
                </div>
              ))}

            
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}
