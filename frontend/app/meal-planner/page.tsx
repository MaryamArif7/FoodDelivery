"use client";

import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";

export default function MealPlanner() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Meal Planner
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            This feature is currently under development.
          </p>

          <button className="bg-2 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105 shadow-lg">
            Notify Me When Ready
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
