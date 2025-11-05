"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("role", "resturant");

      const response = await axios.post(
        "http://localhost:5000/api/signup/resturant",
        formData
      );
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/70 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/50 p-8 md:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-2">
                  Register Your Restaurant
                </h2>
                <p className="text-gray-600">
                  Join FoodRush and grow your business
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Restaurant Name*"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email Address*"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password*"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                    required
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Phone Number*"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Restaurant Address*"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Restaurant Description*"
                    rows={4}
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200 resize-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="openingHours"
                    id="openingHours"
                    placeholder="Opening Hours (e.g., 9:00 AM - 10:00 PM)"
                    className="w-full px-4 py-4 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
                  />
                </div>

                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl p-6 border-2 border-dashed border-orange-300">
                  <label htmlFor="logo" className="block cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-orange-700">
                          Upload Restaurant Logo
                        </p>
                        <p className="text-sm text-gray-600">
                          Click to browse (PNG, JPG)
                        </p>
                      </div>
                    </div>
                  </label>
                  <input type="file" name="logo" id="logo" className="hidden" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-[#FEB21A] hover:to-yellow-500 py-4 rounded-xl text-white text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
                >
                  Register Restaurant
                </button>

                <p className="text-center text-gray-600 mt-4">
                  Already have an account?{" "}
                  <a
                    href="/auth/signin"
                    className="text-red-600 hover:underline font-semibold"
                  >
                    Login
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
