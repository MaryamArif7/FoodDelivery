"use client";
import {useState,useEffect} from 'react';
import { Card } from './card';
import axios from 'axios';
import { ResturantDetails } from './RestaurantDetails ';
import {CuisinesSection} from "./category"
export const ResturantSection = () => {
  const [resturants, setResturants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/resturants");
        setResturants(res.data.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

return (
  <div className="py-6 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      {/* <CuisinesSection /> */}
      
      <div className="mt-8 md:mt-4 lg:mt-16 mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          All Restaurants
        </h1>
      </div>
      
      <div className="space-y-8 md:space-y-12 lg:space-y-16">
        {resturants.map((resturant) => (
          <ResturantDetails key={resturant._id} resturant={resturant} />
        ))}
      </div>
    </div>
  </div>
);
}
