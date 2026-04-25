import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import SupportBox from './components/SupportBox';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserListPage from './pages/admin/UserListPage';
import OrderListPage from './pages/admin/OrderListPage';
import SupportListPage from './pages/admin/SupportListPage';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const socket = io();

      socket.on('paymentNotification', (data) => {
        toast((t) => (
          <span style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>💰 New PhonePe Payment!</strong>
            <span>User <b>{data.userName}</b> reported a payment of <b>₹{data.amount}</b>.</span>
            <Link 
              to={`/order/${data.orderId}`} 
              onClick={() => toast.dismiss(t.id)}
              style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              View Order Details
            </Link>
          </span>
        ), {
          duration: 10000,
          position: 'top-right',
          style: {
            background: '#fff',
            color: '#333',
            border: '2px solid var(--success-color)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '16px',
          },
        });
        
        // Play a notification sound if possible
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed'));
      });

      return () => {
        socket.off('paymentNotification');
        socket.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <>
      <Toaster />
      <Header />
      <main className="main-content container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route path="" element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/placeorder" element={<PlaceOrderPage />} />
            <Route path="/order/:id" element={<OrderPage />} />
          </Route>

          <Route path="" element={<AdminRoute />}>
            <Route path="/admin/productlist" element={<ProductListPage />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
            <Route path="/admin/userlist" element={<UserListPage />} />
            <Route path="/admin/orderlist" element={<OrderListPage />} />
            <Route path="/admin/supportlist" element={<SupportListPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <SupportBox />
    </>
  );
};

export default App;
