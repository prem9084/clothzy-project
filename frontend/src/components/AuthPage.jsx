import { useContext, useState } from "react";
import { AppContext } from "../Conetxt/CartContext";
import axiosInstance from "../axiosInstance/axiosInstance";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import useAuth from "../Conetxt/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
const AuthPage = () => {
  const { setCurrentPage } = useContext(AppContext);
  const { setUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        isLogin ? "/auth/login" : "/auth/register",
        formData
      );
      if (data.success) {
        toast.success(data.message);
        const { token, user } = data;
        setUser(user);
        navigate("/");
        Cookies.set("token", token, {
          expires: 7, // 7 days
          secure: true, // send only over HTTPS
          sameSite: "Strict", // or 'Lax' for cross-site
        });
        setLoading(false);
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error during authentication:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Sign in to your account" : "Join ShopZone today"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all cursor-pointer flex items-center justify-center gap-2
    ${
      loading
        ? "bg-gradient-to-r from-purple-300 to-pink-300 hover:from-purple-300 hover:to-pink-300"
        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
    }
  `}
          >
            {loading && <LoaderCircle className="animate-spin h-5 w-5" />}
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
