import React, { useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";
import { toast } from "react-toastify";
import { Loader, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"
const CreateProduct = () => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
   const [loading,setLoading] = useState(false)
   const navigate = useNavigate()
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const { title, price, description, category, stock } = form;

    if (!title || !price || !description || !category || !stock || !image) {
      toast.error("Please fill in all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("stock", stock);
    formData.append("image", image);

    try {
      const { data } = await axiosInstance.post(
        "/products/add-products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setForm({
          title: "",
          price: "",
          description: "",
          category: "",
          stock: "",
        });
        navigate("/my-products")
        setImage(null);
        setPreviewUrl("");
        setLoading(false)
      } else {
        toast.error(data.message || "Failed to create product");
        setLoading(false)
      }
    } catch (err) {
      console.error("Error creating product:", err);
      
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-purple-200">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Create a New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            rows="3"
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 w-full h-48 object-cover rounded-xl border border-purple-300"
              />
            )}
          </div>

          {/* Submit */}
          {!loading ? (<>  <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-transform transform hover:scale-105 shadow-md"
          >
            🚀 Create Product
          </button></>):(<>  <button
            type="submit"
            className="w-full cursor-pointer bg-gradient-to-r from-purple-300 to-pink-300 text-white font-semibold py-3 rounded-xl  transition-transform transform hover:scale-105 shadow-md"
          >
            <div className="flex justify-center gap-2">

            <Loader2 />  <span>Create Product</span>
            </div>
          </button></>)}
        
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
