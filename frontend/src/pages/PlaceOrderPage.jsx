import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { useLazyGetCouponByCodeQuery } from '../slices/couponsApiSlice';
import { clearCartItems, applyCoupon } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [getCoupon] = useLazyGetCouponByCodeQuery();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const applyCouponHandler = async () => {
    setCouponError('');
    try {
      const coupon = await getCoupon(couponCode).unwrap();
      dispatch(applyCoupon(coupon));
      alert(`Applied ${coupon.discountPercentage}% discount!`);
    } catch (err) {
      setCouponError(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="grid grid-cols-4">
        <div style={{ gridColumn: 'span 3', paddingRight: '2rem' }}>
          <div className="list-group">
            <div className="list-group-item">
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            <div className="list-group-item">
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </div>
            <div className="list-group-item">
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <div className="alert alert-info">Your cart is empty</div>
              ) : (
                <div className="list-group">
                  {cart.cartItems.map((item, index) => (
                    <div className="list-group-item flex-between" key={index}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={item.image} alt={item.name} style={{ width: '50px', borderRadius: '4px' }} />
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>
                      <div>
                        {item.qty} x ₹{item.price} = ₹{(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <div className="list-group">
            <div className="list-group-item">
              <h2>Order Summary</h2>
            </div>
            <div className="list-group-item flex-between">
              <span>Items</span>
              <span>₹{cart.itemsPrice}</span>
            </div>
            <div className="list-group-item flex-between">
              <span>Shipping</span>
              <span>₹{cart.shippingPrice}</span>
            </div>
            <div className="list-group-item flex-between">
              <span>Tax</span>
              <span>₹{cart.taxPrice}</span>
            </div>
            {cart.coupon && (
              <div className="list-group-item flex-between" style={{color: 'var(--primary-color)'}}>
                <span>Discount ({cart.coupon.discountPercentage}%)</span>
                <span>-₹{cart.discountAmount}</span>
              </div>
            )}
            <div className="list-group-item flex-between">
              <strong>Total</strong>
              <strong>₹{cart.totalPrice}</strong>
            </div>

            {!cart.coupon && (
              <div className="list-group-item">
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn btn-outline" onClick={applyCouponHandler}>Apply</button>
                </div>
                {couponError && <span style={{ color: 'var(--danger-color)', fontSize: '0.8rem' }}>{couponError}</span>}
              </div>
            )}

            <div className="list-group-item">
              {error && <div className="alert alert-danger">{error?.data?.message || error.error}</div>}
              <button
                type="button"
                className="btn btn-primary btn-block"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
