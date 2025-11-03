export const CuisinesSection = () => {
  const cuisines = [
    {
      id: 1,
      name: "Pizza",
      image: "/images/pizza.jpeg",
    },
    {
      id: 2,
      name: "Biryani",
      image: "/images/biryani.jpeg",
    },
    {
      id: 3,
      name: "Burgers",
      image: "/images/burger.jpeg",
    },
    {
      id: 4,
      name: "Paratha",
      image: "/images/paratha.jpeg",
    },
    {
      id: 5,
      name: "Ice Cream",
      image: "/images/icecream.jpeg",
    },
  ];

  return (
    <div className="py-8 md:py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 mb-6 md:mb-8 lg:mb-12 text-center">
          Cuisines for you
        </h2>
        
        {/* Grid Layout for Mobile & Tablet, Flex for Desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:flex lg:justify-center lg:gap-12">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.id}
              className="cursor-pointer group text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-2 sm:mb-3 group-hover:scale-105 group-hover:shadow-lg transition-all duration-200 mx-auto border-4 border-transparent group-hover:border-red-500">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                {cuisine.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};