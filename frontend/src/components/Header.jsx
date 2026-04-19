import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

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
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/cart" className="nav-item">
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <span className="badge">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
            </li>
            {userInfo ? (
              <>
                <li style={{ position: 'relative' }}>
                  <Link to="/profile" className="nav-item">
                    <FaUser /> {userInfo.name}
                  </Link>
                </li>
                <li>
                  <button onClick={logoutHandler} className="btn btn-outline" style={{padding: '0.4rem 0.8rem'}}>
                    Logout
                  </button>
                </li>
                {userInfo.isAdmin && (
                  <li style={{display: 'flex', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem'}}>
                    <Link to="/admin/productlist" className="nav-item" style={{color: 'var(--primary-color)'}}>Products</Link>
                    <Link to="/admin/userlist" className="nav-item" style={{color: 'var(--primary-color)'}}>Users</Link>
                    <Link to="/admin/orderlist" className="nav-item" style={{color: 'var(--primary-color)'}}>Orders</Link>
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link to="/login" className="nav-item">
                  <FaUser /> Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
