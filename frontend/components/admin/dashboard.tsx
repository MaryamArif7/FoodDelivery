"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "../common/Sidebar";
import axios from "axios";

export const Dashboard = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const pendingRestaurants = await axios.get(
          "http://localhost:5000/api/restaurants/pending"
        );
        setPendingRestaurants(pendingRestaurants.data);
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
        `http://localhost:5000/api/restaurants/${id}/approve`
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
      <div>
        <h1 className="text-4xl text-red-400">Hi</h1>Admin

      </div>
      {pendingRestaurants.map((restaurant) => (
        <div key={restaurant._id}>
          <h2>{restaurant.name}</h2>
          <button>View Details</button>
          <button onClick={() => approveRestaurant(restaurant._id)}>
            Approve
          </button>
        </div>
      ))}
      <div>{pendingRestaurants.length === 0 && <p>No pending restaurants</p>}</div>
    </Sidebar>
  );
};

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