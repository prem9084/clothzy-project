import React, { useState, useEffect, useContext } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { useParams } from "react-router-dom";
import { AppContext } from "../Conetxt/CartContext";

const ProductViewPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const {addToCart} = useContext(AppContext)
  const { id } = useParams();

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/products/single-product/${id}`
        );
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSingleProduct();
  }, [id]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + amount, product?.stock || 1))
    );
  };

  const handleBuyNow = () => {
    console.log("Buying Now:", product, "Qty:", quantity);
  };

  const handleAddToCart = () => {
    console.log("Add to Cart:", product, "Qty:", quantity);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading product...</p>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-600 mb-8">
          <span>Home</span> / <span>{product.category}</span> /{" "}
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="p-8">
              <div className="relative">
                <img
                  src={
                    product.image }
                  alt={product.title}
                  className="max-w-full max-h-full object-fit rounded-xl"
                />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discount}%
                  </div>
                )}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="p-8 lg:p-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-blue-600 cursor-pointer text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full border-2 border-blue-600 cursor-pointer text-blue-600 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 "   />
                  Add to Cart
                </button>
              </div>

              {/* Share */}
              <div className="flex gap-4 mb-8">
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Shipping & Returns */}
              <div className="border-t border-gray-200 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Truck className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        Free Shipping
                      </div>
                      <div className="text-xs text-gray-600">
                        On orders over $50
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        2 Year Warranty
                      </div>
                      <div className="text-xs text-gray-600">Full coverage</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <RotateCcw className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        30-Day Returns
                      </div>
                      <div className="text-xs text-gray-600">Easy returns</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
