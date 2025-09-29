import { Trash, Store, Clock, Mail, Phone, FileText, Sparkles, TrendingUp } from "lucide-react";
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
    <div className="group relative bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200/50 p-6 rounded-2xl hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-500 hover:-translate-y-1 mb-5">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative space-y-4">
        <div className="flex items-center space-x-3">
          <div className=" p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <img src={restaurant.logo} className="w-12 h-12 " />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-amber-700 transition-colors">
              {restaurant.name}
            </h2>
            <span className="inline-flex items-center space-x-1 text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full mt-1">
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </span>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 space-y-3">
          {restaurant.email && (
            <div className="flex items-center space-x-3 group/item hover:bg-blue-50 p-2 rounded-lg transition-colors">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">{restaurant.email}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="flex items-center space-x-3 group/item hover:bg-green-50 p-2 rounded-lg transition-colors">
              <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">{restaurant.phone}</span>
            </div>
          )}
          {restaurant.description && (
            <div className="flex items-start space-x-3 group/item hover:bg-purple-50 p-2 rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{restaurant.description}</p>
            </div>
          )}
        </div>

        {restaurant.createdAt && (
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400 bg-gray-100/50 rounded-lg py-2">
            <Clock className="w-3 h-3" />
            <span>Applied: {formatDate(restaurant.createdAt)}</span>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onApprove(restaurant._id)}
            className="group/btn flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
            <span>Approve</span>
          </button>
          <button
            onClick={() => console.log("Reject functionality can be added here")}
            className="group/btn flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <span>Reject</span>
          </button>
        </div>
      </div>
    </div>
  );
};