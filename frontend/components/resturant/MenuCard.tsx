import { Delete, SquarePen } from "lucide-react";
import { useState } from "react";
import { Trash } from "lucide-react";
export const MenuCard = ({
  item,
  onEdit,
  onDelete,
  isEditing,
  onClose,
  handleSave,
  Deleting,
  cancelDelete,
  handleDelete,
}) => {
  const [editedPrice, setEditedPrice] = useState(item?.price || "");

  return (
    <>
      <div className="relative group bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="p-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-200"
                title="Edit item"
              >
                <SquarePen className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(item)}
                className="p-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors duration-200"
                title="Delete item"
              >
                <Delete className="w-4 h-4" />
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
          <h1 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
            {item?.name}
          </h1>

          <div className="flex items-center justify-center gap-1">
            <span className="text-2xl font-bold text-orange-600">
              ${item?.price}
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {item?.description}
          </p>
        </div>
      </div>
      {isEditing && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Edit Menu Item
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name
                </label>
                <input
                  type="text"
                  value={item?.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                // onClick={(item._id,price)=>{handleSave}}
                onClick={() => handleSave(item._id, editedPrice)}
                className="flex-1 px-4 py-2 bg-1 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {Deleting && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onDelete}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Menu Item
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deletingItem.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
