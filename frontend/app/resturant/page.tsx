import Link from "next/link"

export default function Resturant(){
    return(
        <div>
            <h1>Restaurant Dashboard</h1>
            <p>welcome to the dashboard</p>
           
            <Link href="/resturant/menu">Go to Menu</Link>
            <Link href="/resturant/profile">Go to Profile</Link>
        </div>
    )
}