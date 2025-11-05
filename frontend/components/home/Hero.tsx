import { Nav } from "../common/nav";
import { ChevronRight, Play } from "lucide-react";
import { Bike, ShoppingBag, Utensils } from "lucide-react";

export const Hero = () => {
  return (
    <div>
      <Nav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 py-8 lg:py-10 items-center">
          <div className="flex flex-col justify-center space-y-5 order-2 lg:order-1">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight">
                <span className="block">
                  <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent animate-pulse">
                    Fresh
                  </span>{" "}
                  <span className="text-gray-900">Eats</span>
                </span>
                <span className="block">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                   Fast
                  </span>{" "}
               
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
              Experience the fastest food delivery in town. Quality meals from
              top restaurants, delivered with care to satisfy your hunger
              instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/50 flex items-center justify-center overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Start Ordering
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="group bg-white hover:bg-gray-50 text-gray-800 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border-2 border-gray-200 hover:border-gray-300">
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore More
              </button>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900">5+</div>
                <div className="text-sm text-gray-600">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-600">Orders Daily</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">30min</div>
                <div className="text-sm text-gray-600">Avg Delivery</div>
              </div>
            </div>
          </div>

          <div  className="hidden lg:block relative order-1 lg:order-2">
            <div className="relative z-10">
              <div className="relative">
                <img
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  src="/2neww.png"
                  alt="Food delivery"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//

{
  /* <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-2xl p-4 animate-float">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-bold text-sm">4.9</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Excellent Service</p>
              </div> */
}

{
  /*             
              <div className="absolute bottom-8 -right-4 bg-white rounded-2xl shadow-2xl p-4 animate-float" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-sm">25-30 min</div>
                    <p className="text-xs text-gray-600">Fast Delivery</p>
                  </div>
                </div>
              </div>
            </div> */
}
