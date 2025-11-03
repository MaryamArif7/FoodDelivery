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
    <div className="bg-white lg:bg-transparent">
      <Nav />
      <div className="flex flex-col lg:flex-row justify-between lg:px-8 xl:px-0">
        <div className="space-y-6 md:space-y-8 pt-8 lg:pt-0 px-8 lg:px-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
            <span className="whitespace-nowrap">
              <span className="primary-text inline-block animate-pulse">
                Fast
              </span>{" "}
              <span className="text-gray-800">Food</span>
            </span>
            <br />
            <span className="whitespace-nowrap">
              <span className="secondary-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Fresh
              </span>{" "}
              <span className="primary-text">Rush</span>
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg">
            Experience the fastest food delivery in town. Quality meals from top
            restaurants, delivered with care to satisfy your hunger instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="cta-primary">
              Start Ordering
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border border-gray-200">
              <Play className="mr-2 w-5 h-5" />
              Explore More
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <img className="w-96 h-96" src="/girl.jpg" alt="Food delivery" />
        </div>

        <div className="py-8 md:py-12 lg:py-16 px-6 lg:px-0">
          <div className="max-w-md mx-auto lg:mx-0 space-y-6 md:space-y-8">
            {services.map((service) => (
              <div key={service.title} className="flex items-start space-x-4 md:space-x-6">
                <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl shadow-sm flex items-center justify-center">
                  {service.icon}
                </div>
                <div className="flex-1 pt-1 md:pt-2">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};