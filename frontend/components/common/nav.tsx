import Link from "next/link"

export const Nav=()=>{
    return(
        <div>

          <div className="flex justify-between text-2xl bg-black text-white p-4">
            <Link href="/">Home</Link>
            <Link href="/auth/signin">Login</Link>
            <Link href="/auth/signup">Register</Link>
          </div>
        </div>
    )
}