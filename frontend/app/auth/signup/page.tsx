"use client"
import axios from "axios";
import router, { useRouter } from "next/navigation";
export default function Register() {
  const router=useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try{
         const formData = new FormData(e.currentTarget);

      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        role: "user",
      };
 
      await axios.post("http://localhost:5000/api/signup/user", data);
      }
     
    
    catch (error) {
      console.error("Error signing up:", error);
    } finally {
      router.push("/");
    }
  };
  return (
    <>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-4rem)]">
        <h1>Register Page</h1>
        <form className="flex flex-col gap-4 bg-black text-white" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input type="text" placeholder=" Please enter your name" />
          <label htmlFor="email">Email</label>
          <input type="email" placeholder=" Please enter your email" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder=" Please enter your password" />
          <label htmlFor="phone">Phone</label>
          <input type="tel" placeholder=" Please enter your phone number" />
          <label htmlFor="address">Address</label>
          <input type="text" placeholder=" Please enter your address" />
            <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};
