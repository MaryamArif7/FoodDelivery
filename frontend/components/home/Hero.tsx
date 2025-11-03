import { Nav } from "../common/nav";
import { ChevronRight, Play } from "lucide-react";
import { Bike, ShoppingBag, Utensils } from "lucide-react";

export const Hero = () => {
  const services = [
    {
      icon: <Bike className="w-8 h-8 text-gray-800" />,
      title: "Fast delivery",
      description: "Promise to deliver within 30 mins",
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-gray-800" />,
      title: "Pick up",
      description: "Pickup delivery at your doorstep",
    },
    {
      icon: <Utensils className="w-8 h-8 text-gray-800" />,
      title: "Dine in",
      description: "Enjoy your food fresh crispy and hot",
    },
  ];

  return (
    <div className="min-h-screen bg-white lg:bg-transparent">
      <Nav />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 py-8 lg:py-12">
          
          {/* Left Column - Hero Text */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black leading-tight">
              <span className="block">
                <span className="primary-text inline-block animate-pulse bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Fast
                </span>{" "}
                <span className="text-gray-800">Food</span>
              </span>
              <span className="block mt-2">
                <span className="secondary-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Fresh
                </span>{" "}
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">Rush</span>
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-base xl:text-lg text-gray-600 leading-relaxed max-w-lg">
              Experience the fastest food delivery in town. Quality meals from top
              restaurants, delivered with care to satisfy your hunger instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">
                Start Ordering
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-bold text-base lg:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border border-gray-200">
                <Play className="mr-2 w-5 h-5" />
                Explore More
              </button>
            </div>
          </div>

          {/* Middle Column - Image (hidden on mobile and tablet) */}
          <div className="hidden xl:flex xl:col-span-3 items-center justify-center">
            <img 
              className="w-full max-w-sm h-auto object-contain" 
              src="/girl.jpg" 
              alt="Food delivery" 
            />
          </div>

          {/* Right Column - Services */}
          <div className="lg:col-span-7 xl:col-span-4 flex items-center">
            <div className="w-full max-w-md mx-auto lg:mx-0 space-y-6 md:space-y-6 lg:space-y-8">
              {services.map((service) => (
                <div key={service.title} className="flex items-start space-x-4 md:space-x-5 lg:space-x-6 p-4 lg:p-0">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-2xl bg-gray-50 shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
                    {service.icon}
                  </div>
                  <div className="flex-1 pt-1 md:pt-2">
                    <h3 className="text-lg md:text-xl lg:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base lg:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};