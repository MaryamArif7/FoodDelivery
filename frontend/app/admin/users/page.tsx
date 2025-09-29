"use client";
import { Sidebar } from "../../../components/admin/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const Res = await axios.get(
          "http://localhost:5000/api/admin/users"
        );
        setAllUsers(Res.data.data || []);
      } catch (error) {
        console.error("Error fetching restaurants", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Sidebar>
      <h1 className="text-3xl font-bold ml-5 mb-6">Manage All Users Here</h1>

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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length > 0 ? (
                  allUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 border-b">
                        {user.email}
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
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}