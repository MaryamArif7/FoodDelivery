'use client';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('token');
        setAuthenticated(!!token);
        setIsLoading(false);

    }, [])
    const checkAuth = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem("redirectAfterLogin", window.location.pathname);
            router.push('/login')

            return false;
        }
        setAuthenticated(true);
        return true;
    }
    const logout = () => {
        localStorage.removeItem("token");
        setAuthenticated(false);
        router.push("/login");
    };
    return {
        checkAuth,
        authenticated,
        isLoading,
        logout
    };
}