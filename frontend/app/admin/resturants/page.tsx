"use client";
import { Sidebar } from "../../../components/admin/Sidebar";
import { ActiveResturantCard } from "@/components/admin/ActiveResturantCard";
import { PendingRestaurantCard } from "@/components/admin/PedingResturantCard";
import { useEffect, useState } from "react";
import axios from "axios";
export default function Resturants() {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [activeRestaurants, setActiveRestaurants] = useState([]);
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const [pendingRes, activeRes] = await Promise.all([
          axios.get("http://localhost:5000/api/resturants/pending"),
          axios.get("http://localhost:5000/api/resturants"),
        ]);
        console.log(activeRes);
        setPendingRestaurants(pendingRes.data.data || []);
        setActiveRestaurants(activeRes.data.data || []);
        console.log(activeRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchRestaurants();
  }, []);

  //click on approve button ,api call is made to approve this restaurant
  //if req was successfull then we need to update the current state which holds the pending restaurants
  //then get the restaurants and filter the restaurant which was approved
  const approveRestaurant = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/resturants/${id}/approve`
      );
      if (response.status === 200) {
        setPendingRestaurants((prev) =>
          prev.filter((restaurant) => restaurant._id !== id)
        );
      }
    } catch (error) {
      console.error("Error approving restaurant", error);
    }
  };
  return (
    <Sidebar>
      <h1 className="text-3xl font-bold">Manage All Resturants Here</h1>

      <div className="flex justify-between mt-20 gap-5">
        <div className="border border-gray-200 p-8  ">
          <h1 className="text-xl font-bold mb-4 ">Active Resturants</h1>
          <div className="h-80 overflow-y-auto space-y-4">
            {activeRestaurants.map((activeResturant) => {
              return (
                <ActiveResturantCard
                  key={activeResturant._id}
                  name={activeResturant?.name}
                  createdAt={activeResturant.createdAt}
                />
              );
            })}
          </div>
        </div>
        <div>
         
          <div className="border border-gray-200 p-8">
             <h2 className="text-xl font-bold mb-4">Pending Restaurants</h2>
            {pendingRestaurants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No pending restaurants</p>
              </div>
            ) : (
              <div className="h-80 overflow-y-auto spacey-4">
                {pendingRestaurants.map((restaurant) => (
                  <PendingRestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    onApprove={approveRestaurant}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
/*  Difference between using prev and using state directly to updated new state
1)The problem with directly using pendingRestaurants
->pendingRestaurants inside function is not guaranteed to be the latest value.
->React state updates are asynchronous and batched.
->That means:
->When  call setPendingRestaurants(...), React schedules the update.
->If another update happens before React re-renders,  pendingRestaurants variable in this function might be stale (an old snapshot of state).
So, if  use the state variable directly,  risk overwriting or missing updates.

2)Why (prev) => ... works
When you pass a function to setPendingRestaurants, React guarantees:
It will call function with the latest value of state at that exact moment.
Even if multiple updates were queued, each updater function will run in order, each time receiving the fresh state.
3)
Without prev:
Both functions capture the same old snapshot of pendingRestaurants.
Each update filters out only one restaurant, then overwrites the state.
End result: one of the approved restaurants might reappear in state! 
With prev:
First update runs: removes restaurant A.
React updates the state.
Second update runs: now gets the new list (without A), removes B.
End result: both A and B are gone
4)
Do I need the old value to calculate the new one?

If NO → use state directly.

If YES → use prev.

*/
