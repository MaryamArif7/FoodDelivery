export const PendingRestaurantCard = ({ restaurant, onApprove }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };
  return (
    <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg shadow-sm mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {restaurant.name}
      </h2>

      {restaurant.email && (
        <p className="text-sm text-gray-600 mb-1">Email: {restaurant.email}</p>
      )}

      {restaurant.phone && (
        <p className="text-sm text-gray-600 mb-1">Phone: {restaurant.phone}</p>
      )}

      {restaurant.description && (
        <p className="text-sm text-gray-600 mb-1">
          Description: {restaurant.description}
        </p>
      )}
      {restaurant.createdAt && (
        <p className="text-xs text-gray-500 mb-3">
          Applied:{formatDate(restaurant.createdAt)}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onApprove(restaurant._id)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
        >
          Approve
        </button>

        <button
          onClick={() => console.log("Reject functionality can be added here")}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
        >
          Reject
        </button>
      </div>
    </div>
  );
};
