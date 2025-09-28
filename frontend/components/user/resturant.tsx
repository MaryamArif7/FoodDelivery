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
          <p className="text-gray-600">Loading delicious restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
         <CuisinesSection />
        <div className=" mb-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 px-8 text-center">
             All Restaurants
          </h1>
        </div>
        
        <div className="space-y-16">
          {resturants.map((resturant) => (
            <ResturantDetails key={resturant._id} resturant={resturant} />
          ))}
        </div>
      </div>
    </div>
  );
}
