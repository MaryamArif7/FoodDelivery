"use client";
import { Sidebar } from "../../../components/admin/Sidebar";
import { ActiveResturantCard } from "@/components/admin/ActiveResturantCard";
import { PendingRestaurantCard } from "@/components/admin/PedingResturantCard";
import { useEffect, useState } from "react";
import { Trash, Store, Clock, Mail, Phone, FileText, Sparkles, TrendingUp } from "lucide-react";
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
      <h1 className="text-3xl font-bold ml-5">Manage All Resturants Here</h1>

     <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          <div className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all duration-700">
            <div className="relative overflow-hidden rounded-t-3xl  p-6">
          
              <div className="relative flex items-center space-x-3  border-b-gray-100">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Store className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-emerald-600">Active Resturants</h1>
                  <p className="text-emerald-600">Currently operating restaurants</p>
                </div>
                
                <div className="ml-auto  bg-emerald-600/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className=" text-emerald-600 font-bold text-lg">{activeRestaurants.length}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-emerald-300 hover:scrollbar-thumb-emerald-400">
                {activeRestaurants.map((activeResturant) => (
                  <ActiveResturantCard
                    key={activeResturant._id}
                    name={activeResturant?.name}
                    createdAt={activeResturant?.createdAt}
                    resturant={activeResturant}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="group bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-700">
            <div className="relative overflow-hidden rounded-t-3xl  p-6">
              <div className="relative flex items-center space-x-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-600">Pending Restaurants</h2>
                  <p className="text-amber-600">Awaiting approval</p>
                </div>
                <div className="ml-auto bg-amber-600/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-amber-600 font-bold text-lg">{pendingRestaurants.length}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {pendingRestaurants.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                      <Store className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No pending restaurants</h3>
                    <p className="text-gray-500 max-w-sm">New restaurant applications will appear here for your review</p>
                  </div>
                </div>
              ) : (
                <div className="h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-amber-300 hover:scrollbar-thumb-amber-400">
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
