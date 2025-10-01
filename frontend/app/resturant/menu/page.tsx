"use client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../../components/resturant/sidebar";
import { MenuCard } from "@/components/resturant/MenuCard";
export default function Menu() {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.target->the input that triggered the change
    //e.target.id->is the id of that fild which tells which field is being chnage,like name,dex etc
    //e.target.value->the latest value typed in the input
    const { id, value, files } = e.target as HTMLInputElement;
    setCurrentItem((prev) => ({
      //prev has all the old fields

      ...prev,
      //[id]: files ? files[0] : value → replace only the field that changed.
      [id]: files ? files[0] : value,
      // Then setCurrentItem updates just that field:

      //...prev → keep all the old fields (don’t wipe them out).

      //[id]: files ? files[0] : value → replace only the field that changed.
    }));
  };
  //React controlled input →  must wire onChange → grab e.target.value → update state with it.
  // prev is needed to keep all the other fields in the form while only updating the one that changed.
  const handleAddItem = () => {
    if (items.length >= 5) {
      toast.error("Max 5 items allowed");
      return;
    }
    setItems((prev) => [...prev, currentItem]);
    setCurrentItem({ name: "", description: "", price: "", image: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Items", items);
    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }
    const formData = new FormData();
    const itemsWithoutFiles = items.map(({ image, ...rest }) => rest);
    formData.append("items", JSON.stringify(itemsWithoutFiles));
    console.log(items);
    items.forEach((item) => {
      if (item.image) {
        formData.append("images", item.image);
      }
    });

    try {
      const res = await axios.post(
        `http://localhost:5000/api/resturants/${user.id}/addMenu`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Menu added:", res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const onMenuEdit = () => {};
  const onMenuDelete = () => {};

  return (
    <Sidebar>
      {user?.menu.length > 1 ? (
        <div className="max-w-6xl mx-auto p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Add Your Menu Items
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
           
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Item Details
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
               
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentItem.name}
                    onChange={handleChange}
                    placeholder="e.g., Margherita Pizza"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

           
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={currentItem.description}
                    onChange={handleChange}
                    placeholder="Describe your delicious item..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                </div>

         
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Price ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={currentItem.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

               
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Product Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 file:cursor-pointer cursor-pointer focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  {currentItem.image && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(currentItem.image)}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  )}
                </div>

              
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex-1 bg-1 hover:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 transform active:scale-95 shadow-md"
                  >
                    + Add to List
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 transform active:scale-95 shadow-md"
                  >
                    Submit Menu
                  </button>
                </div>
              </form>
            </div>

          
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  Preview Items
                </h3>
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                  {items.length}/4 items
                </span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                
                  <p className="text-lg font-medium">No items added yet</p>
                  <p className="text-sm">
                    Add items using the form on the left
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                     
                        <div className="flex-shrink-0">
                          {item.image ? (
                            <img
                              src={URL.createObjectURL(item.image)}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-red-400 rounded-lg flex items-center justify-center text-3xl">
                              🍜
                            </div>
                          )}
                        </div>

                      
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-gray-800 truncate">
                              {item.name}
                            </h4>
                            <span className="text-orange-600 font-bold whitespace-nowrap">
                              ${item.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                       
                        <button
                          onClick={() => {
                            setItems(items.filter((_, i) => i !== index));
                          }}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mt-10 font-bold text-3xl mb-10">
            Manage your Menu Here
          </h2>
          <div className="flex justify-between gap-5 ">
            {user.menu.map((item, index) => (
              <MenuCard
                key={item._id}
                item={item}
                onEdit={onMenuEdit}
                onDelete={onMenuDelete}
              />
            ))}
          </div>
        </div>
      )}
    </Sidebar>
  );
}
