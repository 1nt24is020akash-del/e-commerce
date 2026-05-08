import { Routes, Route, Link, Navigate } from 'react-router-dom';
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
import AdminNotificationPage from './pages/admin/AdminNotificationPage';
import AdminMediaPage from './pages/admin/AdminMediaPage';

import { useSubscribeMutation } from './slices/notificationsApiSlice';

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [subscribe] = useSubscribeMutation();

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  useEffect(() => {
    const socket = io();

    // Register Service Worker for Push Notifications
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          
          if (userInfo) {
            let subscription = await registration.pushManager.getSubscription();
            if (!subscription) {
              const publicVapidKey = 'BLd2XBPj_IoTs1Hrr7RFQVRJwnK8bZuKUEXm3Z0DjTkBVDIgPtnzLAscI4mXCEvjLp--YCFoCdwhUspihMlswyg';
              subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
              });
              await subscribe(subscription).unwrap();
            } else {
              await subscribe(subscription).unwrap();
            }
          }
        } catch (error) {
          console.error('Service Worker error:', error);
        }
      };
      registerServiceWorker();
    }

    socket.on('newAnnouncement', (data) => {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(() => {});

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
          fontSize: '1.2rem',
          boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
        }
      });
    });

    if (userInfo?.isAdmin) {
      socket.on('paymentNotification', (data) => {
        toast((t) => (
          <span style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>💰 New Payment!</strong>
            <span>User <b>{data.userName}</b> paid <b>₹{data.amount}</b>.</span>
            <Link to={`/order/${data.orderId}`} onClick={() => toast.dismiss(t.id)} style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
              View Order
            </Link>
          </span>
        ), { duration: 10000, position: 'top-right' });
        
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {});
      });

      socket.on('newOrderNotification', (data) => {
        toast((t) => (
          <span style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <strong>📦 New Order!</strong>
            <span>User <b>{data.userName}</b> ordered for <b>₹{data.totalPrice}</b>.</span>
            <Link to={`/order/${data.orderId}`} onClick={() => toast.dismiss(t.id)} style={{ color: '#4f46e5', fontWeight: 'bold' }}>
              View Order
            </Link>
          </span>
        ), { duration: 10000, position: 'top-right' });
        
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(() => {});
      });
    }

    return () => {
      socket.off('newAnnouncement');
      socket.off('paymentNotification');
      socket.off('newOrderNotification');
      socket.disconnect();
    };
  }, [userInfo, subscribe]);

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
            <Route path="/admin" element={<Navigate to="/admin/productlist" replace />} />
            <Route path="/admin/productlist" element={<ProductListPage />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
            <Route path="/admin/userlist" element={<UserListPage />} />
            <Route path="/admin/orderlist" element={<OrderListPage />} />
            <Route path="/admin/supportlist" element={<SupportListPage />} />
            <Route path="/admin/notifications" element={<AdminNotificationPage />} />
            <Route path="/admin/media" element={<AdminMediaPage />} />
            <Route path="/chat" element={<AdminChatPage />} />
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
