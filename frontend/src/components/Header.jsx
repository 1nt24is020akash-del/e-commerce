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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
          <Link to="/" className="logo">
            <span>🛍️</span> MERN E-Shop
          </Link>
          {userInfo && (
            <span className="welcome-msg">
              Welcome, {userInfo.name}{userInfo.isAdmin ? ' (owner)' : ''}!
            </span>
          )}
          <SearchBox />
        </div>

        <nav>
          <ul className="nav-links" style={{ alignItems: 'center', gap: '1.2rem' }}>
            <li>
              <Link to="/cart" className="nav-link">
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <span className="badge">{cartItems.reduce((a, c) => a + c.qty, 0)}</span>
                )}
              </Link>
            </li>

            {userInfo ? (
              <>
                <li>
                  <Link to="/profile" className="nav-link">
                    <FaUser /> {userInfo.name.split(' ')[0]} {userInfo.isAdmin && '(owner)'}
                  </Link>
                </li>
                <li>
                  <button onClick={logoutHandler} className="btn-logout">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="nav-link"><FaUser /> Login</Link>
              </li>
            )}

            {userInfo && userInfo.isAdmin && (
              <div className="admin-links" style={{ display: 'flex', gap: '1.2rem', marginLeft: '1rem', borderLeft: '1px solid #eee', paddingLeft: '1rem' }}>
                <Link to="/admin/productlist" className="nav-link-admin">Products</Link>
                <Link to="/admin/userlist" className="nav-link-admin">Users</Link>
                <Link to="/admin/orderlist" className="nav-link-admin">Orders</Link>
                <Link to="/admin/supportlist" className="nav-link-admin">Support</Link>
                <Link to="/chat" className="nav-link-admin">Chat</Link>
              </div>
            )}

            <li>
              <button onClick={toggleTheme} className="theme-toggle-btn">
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
