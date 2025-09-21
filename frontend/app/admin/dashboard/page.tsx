import { useEffect, useState } from "react";
import axios from "axios";
export default function Dashboard() {
  const [pendingResturants, setPendingResturants] = useState([]);

  useEffect(() => {
    const fetchResturants = async () => {
      const pendingResturants = await axios.get(
        "http://localhost:5000/api/resturants/pending"
      );
      setPendingResturants(pendingResturants.data);
    };
    fetchResturants();
  }, []);

  const approveResturant = async (id) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/resturants/${id}/approve`
      );
      if (response.status === 200) {
        setPendingResturants((prev) =>
          prev.filter((resturant) => resturant._id !== id)
        );
      }
    } catch (error) {
      console.error("Error approving restaurant", error);
    }
  };
  return (
    <>
      <div>Admin</div>
      {pendingResturants.map((resturant) => (
        <div key={resturant._id}>
          <h2>{resturant.name}</h2>
          <button>View Details</button>
          <button onClick={() => approveResturant(resturant._id)}>
            Approve
          </button>
        </div>
      ))}
      <div>{pendingResturants.length === 0 && <p>No pending restaurants</p>}</div>
    </>
  );
}
