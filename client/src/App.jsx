import { Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import { Toaster } from 'react-hot-toast';
import Collection from './pages/public/Collection';
import Cart from './pages/public/Cart';
import Product from './pages/public/Product';
import PlaceOrder from './pages/public/PlaceOrder';
import Orders from './pages/public/Orders';
import OrderDetails from './pages/public/OrderDetails';
import Login from './pages/auth/Login';
import AuthLayout from './layouts/AuthLayout';
import Wishlist from './pages/public/Wishlist';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import DashboardLayout from './layouts/DashboardLayout';
import ListProduct from './pages/admin/ListProduct';
import OrdersProduct from './pages/admin/OrdersProduct';
import AddProduct from './pages/admin/AddProduct';
import DashboardHome from './pages/admin/DashboardHome';

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        {/* public layouts */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="collection" element={<Collection />} />
        </Route>

        {/* admin layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />

          <Route path="list" element={<ListProduct />} />

          <Route path="add" element={<AddProduct />} />

          <Route path="orders" element={<OrdersProduct />} />
        </Route>

        {/* auth layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
};
export default App;
