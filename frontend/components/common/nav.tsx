import Link from "next/link"

export const Nav = () => {
  return (
    <nav className="flex items-center justify-between   ">
    
  <div>
  <img 
    src="/logo3.png" 
    alt="Company Logo" 
    className="w-52 h-52 "
  />
</div>
      <div className="flex items-center gap-6 text-2xl">
        <Link 
          href="/" 
          className="primary-text font-bold transition-colors duration-200"
        >
          Home
        </Link>
        <Link 
          href="/auth/signin" 
          className="primary-text font-bold transition-colors duration-200"
        >
          Login
        </Link>
        <Link 
          href="/auth/signup" 
          className="primary-text font-bold transition-colors duration-200"
        >
          Register
        </Link>
         <Link 
          href="/" 
          className="primary-text font-bold transition-colors duration-200"
        >
          Menu
        </Link>
         <Link 
          href="/" 
          className="primary-text font-bold transition-colors duration-200"
        >
          Resturants
        </Link>
        
      </div>
    </nav>
  )
}