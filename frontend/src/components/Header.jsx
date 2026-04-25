import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaChevronDown, FaStore, FaBell, FaDownload } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useState, useEffect } from 'react';
import SearchBox from './SearchBox';
import MusicPlayer from './MusicPlayer';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <div className="container header-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="logo">
            <span>🛍️</span> MERN E-Shop
          </Link>
          {userInfo && (
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Welcome, {userInfo.name}!
            </span>
          )}
          <SearchBox />
        </div>
        <nav style={{ flexShrink: 0 }}>
          <ul className="nav-links" style={{ gap: '2rem', alignItems: 'center' }}>
            {userInfo ? (
              <li className="nav-dropdown-wrapper">
                <div className="nav-item-flex">
                  <FaUser style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }} />
                  <span style={{ fontWeight: '500', color: '#333' }}>{userInfo.name.split(' ')[0]}</span>
                  <FaChevronDown style={{ fontSize: '0.7rem', color: '#666' }} />
                </div>
                <div className="nav-dropdown-menu card-glass">
                  <Link to="/profile">My Profile</Link>
                  {userInfo.isAdmin && (
                    <>
                      <Link to="/admin/productlist">Dashboard</Link>
                      <Link to="/admin/orderlist">Orders</Link>
                      <Link to="/admin/supportlist">Support</Link>
                    </>
                  )}
                  <button onClick={logoutHandler}>Logout</button>
                </div>
              </li>
            ) : (
              <li>
                <Link to="/login" className="nav-item-flex" style={{ color: '#2874f0', fontWeight: '600' }}>
                  <FaUser /> Login
                </Link>
              </li>
            )}

            <li className="nav-dropdown-wrapper">
              <div className="nav-item-flex">
                <span style={{ fontWeight: '500', color: '#333' }}>More</span>
                <FaChevronDown style={{ fontSize: '0.7rem', color: '#666' }} />
              </div>
              <div className="nav-dropdown-menu card-glass">
                <Link to="/contact"><FaBell /> Notifications</Link>
                <Link to="/support"><FaStore /> Sell on MERN</Link>
                <Link to="/download"><FaDownload /> Download App</Link>
              </div>
            </li>

            <li>
              <Link to="/cart" className="nav-item-flex" style={{ position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <FaShoppingCart style={{ fontSize: '1.4rem', color: '#333' }} />
                  {cartItems.length > 0 && (
                    <span className="cart-badge-flipkart">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  )}
                </div>
                <span style={{ fontWeight: '500', color: '#333' }}>Cart</span>
              </Link>
            </li>

            <li>
              <button 
                onClick={toggleTheme} 
                className="theme-toggle-btn"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? <FaMoon /> : <FaSun />}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <MusicPlayer />
    </header>
  );
};

export default Header;
