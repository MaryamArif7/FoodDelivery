"use client"
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const registerResturant=()=>{
    router.push("/auth/signup/resturant")
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        role: "user",
      };

     const response= await axios.post("http://localhost:5000/api/signup/user", data);

      
    } catch (error) {
      console.error("Error signing up:", error);
    
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-4rem)]">
        <h1>Register Page</h1>
        <form className="flex flex-col gap-4 bg-black text-white" onSubmit={handleSubmit}>
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
          
          <button type="submit">Register</button>
        </form>
         <button onClick={registerResturant}>Register</button>
      </div>
    </>
  );
}