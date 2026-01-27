import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import axios from "axios";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthenticateProvider } from './context/AuthenticateContext';
import { CustomerProvider } from "./context/CustomerContext.jsx"
import { CategoryProvider } from "./context/CategoryContext.jsx";
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext.jsx';

import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Orders from './pages/Orders/';
import Customers from './pages/Customers';
import ProductWithColorOptions from "./pages/ProductVariants/index.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import Faq from './pages/Faq';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/Terms/index.jsx';
import Contact from './pages/Contact';

import Cart from './components/Cart/'
import CheckoutWrapper from "./Wrapper/CheckoutWrapper.jsx"
import AdminRoute from "./components/AdminRoute";
import AuthUserRoute from './components/AuthUserRoute';
import UserProfile from './pages/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <AuthenticateProvider>
    <CustomerProvider>
      <CartProvider>
        <CategoryProvider>
          <ProductProvider>
            <OrderProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/admin-category" element={
                    <AdminRoute>
                      <Categories />
                    </AdminRoute>
                  }
                  />
                  <Route path="/admin-products" element={
                    <AdminRoute>
                      <Products />
                    </AdminRoute>
                  }
                  />

                  <Route path="/admin-product-with-colors" element={
                    <AdminRoute>
                      <ProductWithColorOptions />
                    </AdminRoute>
                  }
                  />

                  <Route path="/admin-orders" element={
                    <AdminRoute>
                      <Orders />
                    </AdminRoute>
                  }
                  />

                  <Route path="/admin-customers" element={
                    <AdminRoute>
                      <Customers />
                    </AdminRoute>
                  }
                  />

                  <Route path="/profile" element={
                    <AuthUserRoute>
                      <UserProfile />
                    </AuthUserRoute>
                  }
                  />

                  <Route path="/" element={<Home />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={< TermsAndConditions />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<CheckoutWrapper />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </ProductProvider>
        </CategoryProvider>
      </CartProvider>
    </CustomerProvider>
  </AuthenticateProvider>
)
