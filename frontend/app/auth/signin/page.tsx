"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/authSlice";
export default function Login() {
  const router = useRouter();
const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      const result = await axios.post("http://localhost:5000/api/signin", data);
      console.log(result);
       dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
      if ( result?.data?.user?.role==="user"){
        router.push("/user");
      }
      if ( result?.data?.user?.role==="restaurant"){
        router.push("/resturant");
      }
      if ( result?.data?.user?.role==="driver"){
        router.push("/driver");
      }
      if ( result?.data?.user?.role==="admin"){
        router.push("/admin");
      }
    
    
    
    
  
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-4rem)]">
        <h1>Login Page</h1>
        <form
          className="flex flex-col gap-4 bg-black text-white"
          onSubmit={handleSubmit}
        >
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

          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
}
