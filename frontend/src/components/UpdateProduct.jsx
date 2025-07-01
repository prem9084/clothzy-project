import React, { useEffect, useState } from "react";
import {
  Save,
  Upload,
  X,
  ArrowLeft,
  Package,
  DollarSign,
  FileText,
  Tag,
  ImageIcon,
} from "lucide-react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {} from "react-router-dom"
export default function ProductUpdatePage() {
  const [product, setProduct] = useState({
    title: "",
    image: "",
    description: "",
    price: "",
    category: "",
    stock:""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate()
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
  }, []);

  // update product

  const handleProduct = async (e) => {

    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("stock", product.stock);
    

       if (imagePreview) {
      
      const res = await fetch(imagePreview);
      const blob = await res.blob();
      formData.append("image", blob, "profile.jpg");
    }

      const { data } = await axiosInstance.patch(
        `/products/update-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if(data.success){
        toast.success(data.message)
        navigate("/my-products")
        setLoading(false)
      }else{
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setProduct((prev) => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setProduct((prev) => ({ ...prev, image: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Package className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Update Product
                  </h1>
                  <p className="text-sm text-gray-500">
                    Modify product details and information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleProduct} className="space-y-8">
          {/* Product Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Product Image
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/2">
                <div className="relative group">
                  {product?.image ? (
                    <div className="relative w-full max-h-full bg-gray-100 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt="Product preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-50 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload New Image
                </label>
                <div className="mt-1 flex justify-center  px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-indigo-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Product Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={product.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <input
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
              Pricing & Inventory
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className=" cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
