export const MenuCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {(onEdit || onDelete) && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="p-2 bg-2  text-white rounded-lg shadow-md transition-colors duration-200"
              title="Edit item"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item)}
              className="p-2 bg-1  text-white rounded-lg shadow-md transition-colors duration-200"
              title="Delete item"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      <div className="flex justify-center mt-5 mb-4">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-md ring-4 ring-orange-100 group-hover:ring-orange-300 transition-all duration-300">
          {item?.imageUrl ? (
            <img
              src={item?.imageUrl}
              alt={item?.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-red-400 flex items-center justify-center text-5xl">
              🍜
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-800 group-hover:primary-text  transition-colors duration-300">
          {item?.name}
        </h1>

        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold primary-text ">
            ${item?.price}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {item?.description}
        </p>
      </div>
    </div>
  );
};
