
"use client";
import { Nav } from "../common/nav";
import { FloatingElement } from "../home/Animation";
import { ChevronRight, Star, Clock, Truck, MapPin, Play } from 'lucide-react';
import { useEffect, useState } from "react";

export const Hero = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Fast', 'Quick', 'Instant', 'Speedy'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Nav />
      <div className="flex justify-between" >
         <div className="space-y-8">
             

              <FloatingElement delay={400}>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                  <span 
                    key={currentWord}
                    className="text-red-600 inline-block animate-pulse"
                  >
                    {words[currentWord]}
                  </span>{' '}
                  <span className="text-gray-800">Food</span>
                  <br />
                  <span className="text-yellow-500 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Fresh
                  </span>{' '}
                  <span className="text-red-600">Rush</span>
                </h1>
              </FloatingElement>

              <FloatingElement delay={600}>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Experience the fastest food delivery in town. Quality meals from top restaurants, 
                  delivered with care to satisfy your hunger instantly.
                </p>
              </FloatingElement>

              <FloatingElement delay={800}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center">
                    Start Ordering
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center border border-gray-200">
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </button>
                </div>
              </FloatingElement>
            </div>

       <div>
        <img className="w-96 h-96" src="/1.png" />
       </div>
      </div>
    </>
  );
};
