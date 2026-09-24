import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/public/Home';
import Collection from './pages/public/Collection';
import Cart from './pages/public/Cart';
import Product from './pages/public/Product';
import PlaceOrder from './pages/public/PlaceOrder';
import Orders from './pages/public/Orders';
import OrderDetails from './pages/public/OrderDetails';
import Wishlist from './pages/public/Wishlist';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import Login from './pages/auth/Login';

import DashboardHome from './pages/admin/DashboardHome';
import ListProduct from './pages/admin/ListProduct';
import AddProduct from './pages/admin/AddProduct';
import OrdersProduct from './pages/admin/OrdersProduct';

import ScrollToTop from './common/ScrollToTop';
import AdminRoute from './routes/AdminRoute';
import EditProduct from './pages/admin/EditProduct';

const App = () => {
  return (
    <>
      <Toaster position="top-center" />

      <ScrollToTop />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="collection" element={<Collection />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="place-order" element={<PlaceOrder />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="list" element={<ListProduct />} />
          <Route path="list/edit/:productId" element={<EditProduct />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="orders" element={<OrdersProduct />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
