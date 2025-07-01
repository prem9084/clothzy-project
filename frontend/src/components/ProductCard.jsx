import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Conetxt/CartContext";
import { Heart, Package, ShoppingCart, X } from "lucide-react";

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(AppContext);
  const [isLiked, setIsLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const localStorageKey = "likedProducts";

  // Load liked state from localStorage
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    setIsLiked(!!storedLikes[product.id]);
  }, [product.id]);

  // Save liked state to localStorage when isLiked changes
  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem(localStorageKey)) || {};
    if (isLiked) {
      storedLikes[product.id] = true;
    } else {
      delete storedLikes[product.id];
    }
    localStorage.setItem(localStorageKey, JSON.stringify(storedLikes));
  }, [isLiked, product.id]);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600" };
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  return (
    <>
      <div className="w-[240px] bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div
          className="relative w-full h-[180px] bg-gray-100 cursor-pointer flex items-center justify-center"
          onClick={() => setShowModal(true)}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-fit rounded-t-2xl"
          />

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent modal opening on like click
              setIsLiked((prev) => !prev);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
              isLiked
                ? "bg-red-500 text-white"
                : "bg-white text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </button>

          {/* Category Badge */}
          <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs">
            {product.category.toUpperCase()}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-bold text-sm text-gray-800 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>

          <div className="flex items-center space-x-2 mt-1">
            <Package size={16} className="text-gray-400" />
            <span className={`text-sm ${getStockStatus(product.stock).color} font-medium`}>
              {getStockStatus(product.stock).text}
            </span>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-purple-600">₹{product.price}</span>
            <button
              onClick={() => addToCart(product)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-md hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center gap-1"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full-size image */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-3xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={product.image}
              alt={product.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
