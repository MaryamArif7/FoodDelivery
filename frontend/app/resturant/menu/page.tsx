import Link from "next/link";
import axios from 'axios';
import { useSelector } from "react-redux";
export default function Menu() {
      const { user, role } = useSelector((state) => state.auth)
    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      const formData=new FormData(e.currentTarget);
      const data={
        name:formData.get("name"),
        description:formData.get("description"),
        price:formData.get("price"),
        image:formData.get("image"),
      }
      try{
        const res=await axios.post("http://localhost:5000/api/resturants/${user.id}/addMenu", data)
      }
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" id="name" placeholder="enter the name of the product" />
        <input type="text" id="description" placeholder="enter the description of the product" />
        <input type="number" id="price" placeholder="enter the price of the product" />
        <input type="file" id="image" required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}
