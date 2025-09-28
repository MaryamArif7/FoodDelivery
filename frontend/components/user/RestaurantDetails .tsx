import { Card } from "./card";
export const ResturantDetails = ({ resturant }) => {
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};