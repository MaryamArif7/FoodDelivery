import {useState,useEffect} from 'react';
export const Card = ({ name, description, price, image }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-1 rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        {/* Image container with better styling */}
        <div className="relative mb-6 flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg ring-4 ring-white group-hover:ring-red-200 transition-all duration-300">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-300 flex items-center justify-center text-4xl">
                🍜
              </div>
            )}
          </div>
        </div>

        {/* Content with better typography */}
        <div className="text-center space-y-3">
          <h2 className="primary-text transition-colors duration-200 text-2xl font-bold">
            {name}
          </h2>
          
          <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 px-2">
            {description}
          </p>
          
          <div className="flex items-center justify-center space-x-1">
            <span className="text-2xl font-bold primary-text">₨</span>
            <span className="text-2xl font-bold primary-text">{price}</span>
          </div>
        </div>

        {/* Enhanced button */}
        <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-red-300">
          <span className="flex items-center justify-center space-x-2">
            <span>Order Now</span>
            {isHovered && (
              <svg className="w-4 h-4 transform translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};