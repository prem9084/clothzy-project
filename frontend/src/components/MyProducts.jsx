import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  DollarSign,
  Package,
  X,
  Delete,
  DeleteIcon,
} from "lucide-react";
import axiosInstance from "../axiosInstance/axiosInstance";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyProducts = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);

  // Sample products data
  const [products, setProducts] = useState([]);

  // get own products
  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/get-my-products`);
        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

  // delete product

  const handleDeleteProduct = async (id) => {
    try {
      const { data } = await axiosInstance.delete(
        `/products/delete-product/${id}`
      );
      if (data.success) {
        toast.success(data.message);
        setProducts(products.filter((product) => product._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Out of Stock", color: "text-red-600" };
    if (stock < 10) return { text: "Low Stock", color: "text-yellow-600" };
    return { text: "In Stock", color: "text-green-600" };
  };

  const ProductCard = ({ product }) => (
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
          <p className="text-xs text-gray-500 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-2 mt-2">
            <Package size={16} className="text-gray-400" />
            <span
              className={`text-sm ${
                getStockStatus(product.stock).color
              } font-medium`}
            >
              {getStockStatus(product.stock).text}
            </span>
          </div>

          <span className="text-lg font-bold text-purple-600">
            ₹{product.price}
          </span>

          
          
          {/* Filled Buttons */}
          <div className="flex justify-between mb-4 gap-4 mt-2">
            <Link to={`/update-products/${product._id}`}
              
              className="bg-green-500 w-full hover:bg-green-600 text-white border-2 border-green-500 hover:border-green-600  rounded cursor-pointer transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Edit size={20} />
            </Link>
            
            <button onClick={()=>handleDeleteProduct(product._id)}
            
              className="bg-red-500 w-full hover:bg-red-600 text-white border-2 border-red-500 hover:border-red-600 p-1 rounded cursor-pointer  transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full-size image */}
      {showModal && (
        <div
          className="fixed  inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-3xl max-h-full p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on image click
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

  const ProductRow = ({ product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
      <div className="flex items-center space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 truncate">
            {product.description}
          </p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="font-bold text-purple-600">${product.price}</p>
            <p className="text-xs text-gray-500">Price</p>
          </div>

          <div className="text-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                product.status
              )} capitalize`}
            >
              {product.status}
            </span>
          </div>

          <div className="text-center">
            <p className={`font-medium ${getStockStatus(product.stock).color}`}>
              {product.stock}
            </p>
            <p className="text-xs text-gray-500">Stock</p>
          </div>

          <div className="text-center">
            <p className="font-medium text-gray-800">{product.views}</p>
            <p className="text-xs text-gray-500">Views</p>
          </div>

          <div className="flex space-x-1">
            <button className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
              <Eye size={16} />
            </button>
            <Link
              to={`/update-products/${product._id}`}
              className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
            >
              <Edit size={16} />
            </Link>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="cursor-pointer p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              My Products
            </h1>
            <p className="text-gray-600">
              Manage and track your product listings
            </p>
          </div>

          <Link
            to="/create-product"
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">
                  {products.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Products</p>
                <p className="text-3xl font-bold text-green-600">
                  {products.filter((p) => p.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-blue-600">
                  {products
                    .reduce((sum, p) => sum + p.views, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Eye className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Rating</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {(
                    products.reduce((sum, p) => sum + p.rating, 0) /
                    products.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Star className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 shadow-lg border border-white/50 text-center">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "flex flex-wrap gap-3  justify-center md:flex md:justify-start"
                : "space-y-4"
            }
          >
            {filteredProducts.map((product) =>
              viewMode === "grid" ? (
                <ProductCard key={product.id} product={product} />
              ) : (
                <ProductRow key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProducts;
