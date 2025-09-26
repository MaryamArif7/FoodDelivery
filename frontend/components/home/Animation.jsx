"use client";
import { useEffect, useState } from "react";
export const FloatingElement = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: isVisible ? 'translate-y-0' : 'translate-y-8',
    left: isVisible ? 'translate-x-0' : 'translate-x-8',
    right: isVisible ? 'translate-x-0' : '-translate-x-8'
  };

  return (
    <div 
      className={`transform transition-all duration-1000 ease-out ${
        directionClasses[direction]
      } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {children}
    </div>
  );
};
