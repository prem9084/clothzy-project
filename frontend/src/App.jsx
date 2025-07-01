
import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import CartPage from "./components/CardPage";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import CreateProduct from "./components/createProduct";
import UserProfile from "./components/ProfilePage";
import MyProducts from "./components/MyProducts";
import ProductUpdatePage from "./components/UpdateProduct";

const App = () => {
 
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/profile" element={<UserProfile />} />
         <Route path="/my-products" element={<MyProducts />} />
         <Route path="/update-products/:id" element={<ProductUpdatePage />} />
         
      
      </Routes>
    </>
  );
};

export default App;
