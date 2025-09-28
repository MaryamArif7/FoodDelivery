export const Card = ({ name, description, price, image }) => {
  return (
    <div className="bg-1 rounded-3xl p-6 pt-0 max-w-sm mx-auto shadow-xl transform hover:scale-105 transition-transform duration-300">
      <div className="relative mb-4  z-10 ">
        <div className="w-36 h-36 mx-auto-rounded-full ">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl">
              🍜
            </div>
          )}
        </div>
      </div>

      <h2 className="primary-text font-bold text-2xl text-center mb-1">{name}</h2>
      <p className=" text-center mb-1 line-clamp-2">{description}</p>
      <h1 className="primary-text font-bold text-2xl text-center mb-1">{price}</h1>
       <button className="w-full bg-2 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl">
          Order Now
        </button>
    </div>
  );
};
