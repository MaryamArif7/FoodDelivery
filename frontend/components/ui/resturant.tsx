"use client";
import {useState,useEffect} from 'react';
import { Card } from './card';
import axios from 'axios';
export const Resturants=()=>{
  const [resturants,setResturants]=useState([]);
  useEffect(()=>{
    const fetchData=async()=>{
      const res=await axios.get("http://localhost:5000/api/resturants");
      setResturants(res.data);
    }
    fetchData();
  },[]);
  return(
    <>
      <h1>View All Resturants</h1>
      <ul>
        {resturants.map((resturant)=>(
          <li key={resturant.id}>
            <Card
              name={resturant.name}
              description={resturant.description}
              price={resturant.price}
              image={resturant.image}
            />
          </li>
        ))}
      </ul>
    </>
  )
}



