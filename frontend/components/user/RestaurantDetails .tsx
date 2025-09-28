import { Card } from "./card";
export const ResturantDetails = ({ resturant }) => {
  return (
    <>
      <li key={resturant._id}>
        <h1 className="primary-text font-bold text-4xl  mb-1">{resturant.name}</h1>
        <h1 className="font-bold  mb-1">{resturant.description}</h1>
        <div className="flex justify-between gap-4">
          {resturant.menu.map((menu) => {
            return (
              <>
                <Card
                  key={menu._id}
                  name={menu.name}
                  description={menu.description}
                  price={menu.price}
                  image={menu.imageUrl}
                />
              </>
            );
          })}
        </div>
      </li>
    </>
  );
};
