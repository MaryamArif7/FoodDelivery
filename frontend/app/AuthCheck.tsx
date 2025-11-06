"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../components/common/Loading";
const publicRoutes = ["/", "/login"];

const AuthCheck = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token =
      localStorage.getItem("token");
    const isPublic = publicRoutes.includes(window.location.pathname);
    if (!token && !isPublic) {
      router.push("/login");
    } else if (token && isPublic) {
      router.push("/");
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading width="12" height="12" />
      </div>
    );
  }

  return children;
};

export default AuthCheck;
