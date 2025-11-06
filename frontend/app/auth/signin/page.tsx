"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/authSlice";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const result = await axios.post("http://localhost:5000/api/signin", data);
      console.log(result);
       dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
        localStorage.setItem("token", result.data.token);
      if ( result?.data?.user?.role==="user"){
        router.push("/");
      }
      if ( result?.data?.user?.role==="restaurant"){
        router.push("/resturant");
      }
      if ( result?.data?.user?.role==="driver"){
        router.push("/driver");
      }
      if ( result?.data?.user?.role==="admin"){
        router.push("/admin");
      }
  
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <>
      <div className="bg-[url('/login4.png')] bg-cover bg-center">
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-screen py-12">
            <div className="bg-white/55 rounded-2xl shadow-[0_4px_30px_rgba(71,71,71,0.11)] backdrop-blur-md border border-white/30 py-12 px-10 w-full max-w-md">
              <div className="title flex flex-col items-center mb-8">
                <h4 className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent text-5xl font-bold">
                  Login
                </h4>
              </div>

              <form className="py-1" onSubmit={handleSubmit}>
                <div className="flex flex-col mt-5 items-center gap-6">
                  <input
                    name="email"
                    className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="email"
                    placeholder="Email*"
                    required
                  />

                  <input
                    name="password"
                    className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="password"
                    placeholder="Password*"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-[#FEB21A] hover:to-yellow-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center transition-all duration-200"
                  >
                    Login
                  </button>

                  <span className="text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      className="text-red-600 hover:underline cursor-pointer"
                      href="/auth/signup"
                    >
                      Register
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
