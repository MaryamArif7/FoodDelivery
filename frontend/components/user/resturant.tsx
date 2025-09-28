"use client";
import {useState,useEffect} from 'react';
import { Card } from './card';
import axios from 'axios';
import { ResturantDetails } from './RestaurantDetails ';
export const ResturantSection=()=>{
  const [resturants,setResturants]=useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
      const res=await axios.get("http://localhost:5000/api/resturants");
      setResturants(res.data.data);
    }
    fetchData();
  },[]);
  return(
    <>
      <h1>View All Resturants</h1>
      <ul>
        {resturants.map((resturant)=>(
        <ResturantDetails key={resturant._id} resturant={resturant} />
        ))}
      </ul>
    </>
  )
}



