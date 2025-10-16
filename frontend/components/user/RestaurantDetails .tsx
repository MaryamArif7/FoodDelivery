import { Card } from "./card";
import { useSelector, useDispatch } from "react-redux";
import { addToCart,fetchCartItems } from "@/lib/features/cartSlice"
import toast, { Toaster } from 'react-hot-toast';
export const ResturantDetails = ({ resturant }) => {
  const dispatch=useDispatch();
 const { user } = useSelector((state) => state.auth);
console.log(user);
 const handleAddToCart = (menu) => {
  console.log(user);
  console.log(resturant);
    console.log("price test", { price: resturant?.menu.price });
   dispatch(
     addToCart({
       id: user?.id,
       restaurantId: resturant?._id,
       menuId: menu._id,
       quantity: 1,
       price:menu.price,
       image:menu.imageUrl
       
     })
   ).then((data) => {
     if (data?.payload?.success) {
       dispatch(fetchCartItems(user?.id));
       toast.success("Menu Added to the cart");
     }
     else {
       
        toast.error(data?.payload?.message || "Failed to add item to cart");
      }
   })
   .catch((error) => {
     
      toast.error("Something went wrong");
      console.error("Add to cart error:", error);
    });
 };
  return (
    <div className=" overflow-hidden  hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
      <div className="px-8 mt-2 primary-text">
        <h1 className="text-4xl font-bold mb-3">{resturant.name}</h1>
        
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {resturant.menu.map((menu) => (
            <Card
              key={menu._id}
            
              name={menu.name}
              description={menu.description}
              price={menu.price}
              image={menu.imageUrl}
              menu={menu}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};