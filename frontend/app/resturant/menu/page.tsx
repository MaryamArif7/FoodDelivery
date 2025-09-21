"use client";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Menu() {
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Instead of plain JSON, build FormData
    const data = new FormData();
    data.append("name", formData.get("name") as string);
    data.append("description", formData.get("description") as string);
    data.append("price", formData.get("price") as string);
    data.append("image", formData.get("image") as File); // file upload

    try {
      const res = await axios.post(
        `http://localhost:5000/api/resturants/${user.id}/addMenu`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Menu added:", res.data);
    } catch (error) {
      console.error("Error adding menu:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Enter product name" required />
        <input type="text" name="description" placeholder="Enter description" required />
        <input type="number" name="price" placeholder="Enter price" required />
        <input type="file" name="image" accept="image/*" required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
