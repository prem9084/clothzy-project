import {
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../Conetxt/CartContext";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useAuth from "../Conetxt/AuthContext";
import axiosInstance from "../axiosInstance/axiosInstance";
import { toast } from "react-toastify";

const Header = () => {
  const {
    currentPage,
    setCurrentPage,
    getTotalItems,
    searchTerm,
    setSearchTerm,
  } = useContext(AppContext);

  const { setToken, user, setUser } = useAuth();

  const navigate = useNavigate();

  console.log(Cookies.get("token"));

  const logout = async () => {
    try {
      const { data } = await axiosInstance.post("/auth/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        setToken(null);
        navigate("/auth")
      }
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              <Link to="/">ClothZy</Link>
            </h1>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage("home")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  currentPage === "home"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Link to="/" className="flex flex-row gap-2">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </Link>
              </button>
              <Link
                to="/cart"
                onClick={() => setCurrentPage("cart")}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors relative ${
                  currentPage === "cart"
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </nav>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Dropdown for User Profile */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    {/* <img
                      src={user.avatar || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                    /> */}
                    <div className="hidden md:flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/my-products"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package size={16} /> My Products
                      </Link>
                      <Link
                        to="/create-product"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Plus size={16} /> Create Product
                      </Link>
                      <hr className="my-1" />
                    </div>
                  )}
                </div>

                <button
                  onClick={()=>logout()}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setCurrentPage("auth")}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 mt-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Mobile Navigation */}
              <button
                onClick={() => {
                  setCurrentPage("home");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:text-purple-600"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage("cart");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-2 text-left text-gray-600 hover:text-purple-600"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart ({getTotalItems()})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
