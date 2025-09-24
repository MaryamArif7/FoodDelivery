"use client";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Sidebar } from "../../../components/resturant/sidebar";
export default function Menu() {
  const { user } = useSelector((state) => state.auth);
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

    const formData = new FormData();
    formData.append("items", JSON.stringify(items));
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

  return (
    <Sidebar>

    <div>
      <h2>Add Menu Items (max 5)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          value={currentItem.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
        <input
          type="text"
          id="description"
          value={currentItem.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />
        <input
          type="number"
          id="price"
          value={currentItem.price}
          onChange={handleChange}
          placeholder="Enter price"
          required
        />
        <input
          type="file"
          id="image"
          onChange={handleChange}
          accept="image/*"
          required
        />

        <button type="button" onClick={handleAddItem}>
          Add Another Item
        </button>
        <button type="submit">Add Product</button>
      </form>
      <div>
        <h2>Preview Items</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name}
              <br />
              {item.description}
              <br />
              {item.price}
              <br />
              {item.image && (
                <img src={URL.createObjectURL(item.image)} alt={item.name} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
    </Sidebar>
  );
}
