import { useContext } from "react";
import { AppContext } from "../Conetxt/CartContext";
import ProductCard from "./ProductCard";

const HomePage = () => {
  const { products, categories, selectedCategory, setSelectedCategory } =
    useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Welcome to ShopZone</h2>
          <p className="text-xl mb-8 opacity-90">
            Discover amazing products at unbeatable prices
          </p>
          <div className="max-w-md mx-auto">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Featured Products
          </h3>

          <div className="flex flex-wrap gap-3 justify-center">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
