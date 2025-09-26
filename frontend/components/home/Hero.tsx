import { Nav } from "../common/nav";
import { ChevronRight, Star, Clock, Truck, MapPin, Play } from "lucide-react";
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
    <>
      <Nav />
      <div className="flex justify-between">
        <div className="space-y-8">
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
            <span className="primary-text inline-block animate-pulse">
              Fast
            </span>{" "}
            <span className="text-gray-800">Food</span>
            <br />
            <span className="secondary-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Fresh
            </span>{" "}
            <span className="primary-text">Rush</span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            Experience the fastest food delivery in town. Quality meals from top
            restaurants, delivered with care to satisfy your hunger instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-2 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">
              Start Ordering
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border border-gray-200">
              <Play className="mr-2 w-5 h-5" />
              Explore More
            </button>
          </div>
        </div>

        <div>
          <img className="w-96 h-96" src="/girl.jpg" />
        </div>
        <div className="py-16 px-8 lg:px-16 ">
          <div className="max-w-md mx-auto space-y-8">
            {services.map((service, index) => (
              <div key={service.title} className="flex items-start space-x-6">
                {/* Icon container */}
                <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                  {service.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
