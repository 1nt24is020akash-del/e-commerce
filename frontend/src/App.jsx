import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import SupportBox from './components/SupportBox';
import AnnouncementBar from './components/AnnouncementBar';
import ChatWidget from './components/ChatWidget';
import CategoryNav from './components/CategoryNav';
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
import AdminChatPage from './pages/admin/AdminChatPage';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const socket = io();

    socket.on('newAnnouncement', (data) => {
      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed'));

      toast.success(data.message, {
        duration: 5000,
        position: 'top-center',
        icon: '📢',
        style: {
          background: 'linear-gradient(135deg, #ff0080 0%, #ff8c00 100%)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '20px',
          padding: '24px 40px',
          fontSize: '1.4rem',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.2)',
          maxWidth: '800px',
          animation: 'announcementPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }
      });
    });

    if (userInfo && userInfo.isAdmin) {
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

      socket.on('newOrderNotification', (data) => {
        toast((t) => (
          <span style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>📦 New Order Placed!</strong>
            <span>User <b>{data.userName}</b> just placed a new order for <b>₹{data.totalPrice}</b>.</span>
            <Link 
              to={`/order/${data.orderId}`} 
              onClick={() => toast.dismiss(t.id)}
              style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'underline' }}
            >
              View Order
            </Link>
          </span>
        ), {
          duration: 10000,
          position: 'top-right',
          style: {
            background: '#fff',
            color: '#333',
            border: '2px solid #4f46e5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '16px',
          },
        });
        
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed'));
      });

      return () => {
        socket.off('newAnnouncement');
        socket.off('paymentNotification');
        socket.off('newOrderNotification');
        socket.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <>
      <Toaster />
      <AnnouncementBar />
      <Header />
      <CategoryNav />
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
            <Route path="/admin/chat" element={<AdminChatPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <SupportBox />
      <ChatWidget />
    </>
  );
};

export default App;
