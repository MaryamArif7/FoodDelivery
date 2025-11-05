"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        role: "user",
      };

      const response = await axios.post(
        "http://localhost:5000/api/signup/user",
        data
      );
      router.push("/auth/login");
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  const registerRestaurant = () => {
    router.push("/auth/signup/resturant");
  };

  return (
    <>
      <div className="bg-[url('/login4.png')] bg-cover bg-center min-h-screen">
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-screen py-12">
            <div className="bg-white/55 rounded-2xl shadow-[0_4px_30px_rgba(71,71,71,0.11)] backdrop-blur-md border border-white/30 py-8 px-10 w-full max-w-md">
              <div className="title flex flex-col items-center mb-6">
                <h4 className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent text-5xl font-bold">
                  Register
                </h4>
                <p className="text-gray-600 mt-2 text-sm">
                  Create your account as a user
                </p>
              </div>

              <form
                className="flex flex-col items-center gap-4"
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="name"
                  placeholder="Full Name*"
                  required
                />

                <input
                  type="email"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="email"
                  placeholder="Email*"
                  required
                />

                <input
                  type="password"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="password"
                  placeholder="Password*"
                  minLength={6}
                  required
                />

                <input
                  type="tel"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="phone"
                  placeholder="Phone Number*"
                  required
                />

                <input
                  type="text"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="address"
                  placeholder="Address*"
                  required
                />

                <button
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-[#FEB21A] hover:to-yellow-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register as User"}
                </button>
              </form>

            
              <div className="flex items-center gap-3 my-6 w-3/4 mx-auto">
                <div className="flex-1 h-px bg-gray-400"></div>
                <span className="text-gray-600 text-sm">OR</span>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={registerRestaurant}
                  className="bg-white hover:bg-gray-50 border-2 border-red-500 w-3/4 py-4 rounded-lg text-red-600 text-xl shadow-sm text-center transition-all duration-200"
                  type="button"
                >
                  Register as Restaurant
                </button>

                <span className="text-center text-gray-600 text-sm">
                  Already have an account?{" "}
                  <Link
                    className="text-red-600 hover:underline cursor-pointer font-semibold"
                    href="/auth/sigin"
                  >
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
