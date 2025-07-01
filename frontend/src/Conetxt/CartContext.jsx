import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance/axiosInstance";

// Create Context
const AppContext = createContext();

// Provider Component
const AppProvider = ({ children }) => {
  // ✅ Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch all products
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products/get-all");
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      }
    };
    getAllProducts();
  }, []);

  // Cart: Add Item
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Cart: Remove Item
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  // Cart: Update Quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Cart: Get Total Price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Cart: Get Total Items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get all categories
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    products: filteredProducts,
    setProducts,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom Hook to use the App Context
const useCartContext = () => useContext(AppContext);

// Exporting everything
export { AppProvider, useCartContext, AppContext };
