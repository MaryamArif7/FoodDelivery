"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const formData = new FormData(e.currentTarget);
    formData.append("role", "resturant");

    const response = await axios.post(
      "http://localhost:5000/api/signup/resturant",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  } catch (error) {
    console.error("Error signing up:", error);
  }
};

  return (
    <>
      <div className="">
        <h1>Register Page</h1>
        <form
          className="flex flex-col gap-4 "
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder=" Please enter your name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder=" Please enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=" Please enter your password"
            required
          />

          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            placeholder=" Please enter your phone number"
            required
          />

          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder=" Please enter your address"
            required
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder=" Please enter your description"
            required
          />

          <label htmlFor="openingHours">Opening Hours</label>
          <input
            type="text"
            name="openingHours"
            id="openingHours"
            placeholder=" Please enter your opening hours"
          />
          <label htmlFor="logo">Logo</label>
          <input
            type="file"
            name="logo"
            id="logo"
        
          />
         
         

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}
