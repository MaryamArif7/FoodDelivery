import { useState } from 'react';
import { ShoppingCart} from 'lucide-react';
import {toast} from 'react-hot-toast';
export const Card = ({ name, description, price, image,menu,handleAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
    
  return (
    <div
      className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group max-w-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-44 overflow-hidden p-4 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full overflow-hidden shadow-xl ring-4 ring-white/50 group-hover:ring-white transition-all duration-300 bg-white">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
          <span className="text-red-600 font-bold text-sm">₨{price}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-4">
        <h3 className="text-red-600 font-bold text-xl mb-1.5 text-center">
          {name}
        </h3>

        <p className="text-gray-700 text-xs leading-relaxed mb-3 line-clamp-2 h-8 text-center px-1">
          {description}
        </p>
        <div className="space-y-2">
          {/* <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
            <span className="flex items-center justify-center gap-2">
              <span>Order Now</span>
              {isHovered && (
                
              )}
            </span>
          </button> */}

          <button
            onClick={() => handleAddToCart(menu)}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2.5 px-4 rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <span>Add To Cart</span>
              {isHovered && (
               < ShoppingCart/>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
