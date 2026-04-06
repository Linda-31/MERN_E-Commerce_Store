import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import User from './Pages/user';
import Product from './Pages/product';
import Order from './Pages/order';
import Home from './Pages/home';
import Blog from './Pages/Blog';
import AddBlog from './Pages/AddBlog';
import Dashboard from './Pages/dashboard';
import AddProduct from './Pages/Addproduct';
import UserDetails from './Component/UserDetails';
import ProductDetail from './Component/productDetail';
import OrderDetail from './Component/orderDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductEdit from './Pages/productedit';
import BlogEdit from './Pages/BlogEdit';
import UserEdit from './Component/userEdit';
import ContactMessages from './Pages/contact';
import NewsletterSubscribers from './Pages/newsletter';
import Login from './Pages/Login';


const ProtectedRoute = ({ children }) => {
  const isAdminAuthenticated = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) {
      try {
        const cookieVal = parts.pop().split(';').shift();
        const userData = JSON.parse(atob(cookieVal));
        return userData.role?.toLowerCase().trim() === 'admin';
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  if (!isAdminAuthenticated()) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="user" element={<User />} />
          <Route path="product" element={<Product />} />
          <Route path="order" element={<Order />} /> 
          <Route path="blogs" element={<Blog />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="users/:id" element={<UserDetails />} /> 
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="blogs/edit/:id" element={<BlogEdit />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="contact" element={<ContactMessages />} />
          <Route path="subscribers" element={<NewsletterSubscribers />} />
        </Route>

        {/* Fallback for any other route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}




export default App;
