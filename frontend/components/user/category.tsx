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
    <div className="py-8 px-4 ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Cuisines for you
        </h2>
        
        <div className="flex justify-center gap-8">
          {cuisines.map((cuisine) => (
            <div
              key={cuisine.id}
              className="cursor-pointer group text-center"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 group-hover:scale-105 transition-transform duration-200 mx-auto">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">
                {cuisine.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};