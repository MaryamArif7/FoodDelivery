"use client"
export default function Login() {
    const handleSubmit = () => {
       
     
    }
  return (
    <>
      <div className="bg-gradient-to-b from-blue-50 to-white min-h-[calc(100vh-4rem)]">
        <h1>Login Page</h1>
        <form className="flex flex-col gap-4 bg-black text-white" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" placeholder=" Please enter your email" />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder=" Please enter your password" />
           <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};
