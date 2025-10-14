"use client";
import { Sidebar } from "../../../components/admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, X } from "lucide-react";
export default function Drivers() {
  const [allDrivers, setAllDrivers] = useState([]);
  const[showModal,setShowModal]=useState(false);
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const Res = await axios.get(
          "http://localhost:5000/api/admin/drivers"
        );
        setAllDrivers(Res.data.data || []);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchDrivers();
  }, []);
const handleAddDriver= async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
  try{
const formData = new FormData(e.currentTarget);
      formData.append("role", "driver");

      const response = await axios.post(
        "http://localhost:5000/api/signup/driver",
        formData
      );
  }
  catch(error){
    console.error("Error signing up:", error);
  }
}
  return (
    <Sidebar>
      <div className="flex justify-between mr-8">
        <h1 className="text-3xl font-bold ml-5 mb-6">
          Manage All Drivers Here
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-1 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
        >
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      <div className="min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <div className="overflow-y-auto rounded-lg shadow">
            <table className="w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Email
                  </th>
                   <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allDrivers.length > 0 ? (
                  allDrivers.map((driver, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {driver.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {driver.email}
                      </td>
                       <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {driver.phonedriver}
                      </td>
                      <td className="px-6 py-4 text-sm border-b">
                        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No Driver found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add New Driver
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              <form className="space-y-4" onSubmit={handleAddDriver}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter driver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                   name="email"
                   id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter driver email"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="number"
                   name="phone"
                   id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter driver phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                   type="submit"
                    className="flex-1 px-4 py-2 bg-1 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                  >
                    Add Driver
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
