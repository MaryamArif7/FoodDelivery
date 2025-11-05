"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const registerResturant = () => {
    router.push("/auth/signup/resturant");
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    } catch (error) {
      console.error("Error signing up:", error);
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
              <form
                className="flex flex-col mt-5 items-center gap-6"
                onSubmit={handleSubmit}
              >
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="name"
                  id="name"
                  placeholder=" Please enter your name"
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="email"
                  id="email"
                  placeholder=" Please enter your email"
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="password"
                  id="password"
                  placeholder=" Please enter your password"
                  required
                />

                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="phone"
                  id="phone"
                  placeholder=" Please enter your phone number"
                  required
                />

                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="border-0 px-3 py-4 rounded-xl w-3/4 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  name="address"
                  id="address"
                  placeholder=" Please enter your address"
                  required
                />

                <button
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-[#FEB21A] hover:to-yellow-500 border w-3/4 py-4 rounded-lg text-gray-50 text-xl shadow-sm text-center transition-all duration-200"
                  type="submit"
                >
                  Register
                </button>
              </form>

              <button onClick={registerResturant}>Register</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
