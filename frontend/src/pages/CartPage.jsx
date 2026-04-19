import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="grid grid-cols-4">
      <div style={{ gridColumn: 'span 3' }}>
        <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="alert" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
            Your cart is empty. <Link to="/" style={{fontWeight: 'bold', textDecoration: 'underline', marginLeft: '0.5rem'}}>Go Back</Link>
          </div>
        ) : (
          <div className="list-group">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <div className="product-price">${item.price}</div>
                <div>
                  <select
                    className="form-control"
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <button
                    className="btn btn-outline"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash style={{ color: 'var(--danger-color)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="list-group">
          <div className="list-group-item">
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </h2>
            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </div>
          <div className="list-group-item">
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
