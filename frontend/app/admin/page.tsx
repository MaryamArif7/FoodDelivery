import Link from "next/link"

export default function Admin(){
    return(
        <div>
            <h1>Admin Dashboard</h1>
            <p>welcome to the dashboard</p>
            <h1>check the resturant which have sent request to join food rush</h1>
            <Link href="/admin/dashboard">Go to Dashboard</Link>
        </div>
    )
}