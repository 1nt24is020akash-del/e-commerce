import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      alert('Order marked as delivered!');
    } catch (err) {
      alert(err?.data?.message || err.message);
    }
  };

  useEffect(() => {
    const loadRazorpay = () => {
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };
    loadRazorpay();
  }, []);

  const payHandler = async () => {
    try {
      const { data: { clientId } } = await axios.get('/api/config/razorpay');

      const { data: razorpayOrder } = await axios.post(
        `/api/orders/${orderId}/razorpay`,
        {},
        { withCredentials: true }
      );

      if (razorpayOrder.id.startsWith('order_mock_')) {
        await payOrder({ orderId, details: { razorpay_order_id: razorpayOrder.id, razorpay_payment_id: 'mock_pay_id', razorpay_signature: 'mock_sig' } });
        refetch();
        alert('Mock Payment Successful');
        return;
      }

      const options = {
        key: clientId,
        amount: razorpayOrder.amount,
        currency: 'INR',
        name: 'MERN E-Shop',
        description: 'Test Transaction',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await payOrder({
              orderId,
              details: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            refetch();
            alert('Payment Successful');
          } catch (err) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#4f46e5',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      rzp.open();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <div className="loader"></div>
  ) : error ? (
    <div className="alert alert-danger">{error?.data?.message || error.error}</div>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <div className="grid grid-cols-4">
        <div style={{ gridColumn: 'span 3', paddingRight: '2rem' }}>
          <div className="list-group">
            <div className="list-group-item">
              <h2>Shipping</h2>
              <p><strong>Name: </strong> {order.user.name}</p>
              <p><strong>Email: </strong> {order.user.email}</p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="alert alert-success">Delivered on {order.deliveredAt.substring(0, 10)}</div>
              ) : (
                <div className="alert alert-danger">Not Delivered</div>
              )}
            </div>

            <div className="list-group-item">
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="alert alert-success">Paid on {order.paidAt.substring(0, 10)}</div>
              ) : (
                <div className="alert alert-danger">Not Paid</div>
              )}
            </div>

            <div className="list-group-item">
              <h2>Order Items</h2>
              {order.orderItems.map((item, index) => (
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
          </div>
        </div>

        <div style={{ gridColumn: 'span 1' }}>
          <div className="list-group">
            <div className="list-group-item">
              <h2>Order Summary</h2>
            </div>
            <div className="list-group-item flex-between">
              <span>Items</span>
              <span>₹{order.itemsPrice}</span>
            </div>
            <div className="list-group-item flex-between">
              <span>Shipping</span>
              <span>₹{order.shippingPrice}</span>
            </div>
            <div className="list-group-item flex-between">
              <span>Tax</span>
              <span>₹{order.taxPrice}</span>
            </div>
            <div className="list-group-item flex-between">
              <strong>Total</strong>
              <strong>₹{order.totalPrice}</strong>
            </div>

            {!order.isPaid && order.paymentMethod === 'Cash on Delivery' && (
              <div className="list-group-item">
                <div className="alert alert-info" style={{marginBottom: 0}}>
                  Payment will be collected upon delivery.
                </div>
              </div>
            )}

            {!order.isPaid && order.paymentMethod === 'PhonePe / QR Code' && (
              <div className="list-group-item">
                <div className="alert alert-info" style={{marginBottom: '1rem', textAlign: 'center'}}>
                  <p style={{fontWeight: 'bold', fontSize: '1.1rem'}}>PhonePe / UPI Transfer</p>
                  <p>Please send <strong>₹{order.totalPrice}</strong> to:</p>
                  <p style={{fontSize: '1.3rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--primary-color)'}}>+91 8660385303</p>
                  <p style={{fontSize: '0.9rem'}}>Your order will be processed once we receive the payment.</p>
                </div>
                <a 
                  href={`upi://pay?pa=8660385303@ybl&pn=Admin&am=${order.totalPrice}&cu=INR`}
                  className="btn btn-primary btn-block" 
                  style={{ backgroundColor: '#5f259f', borderColor: '#5f259f', display: 'block', textAlign: 'center' }}
                >
                  Open PhonePe / UPI App
                </a>
              </div>
            )}

            {!order.isPaid && (order.paymentMethod === 'ATM Card' || order.paymentMethod === 'Razorpay') && (
              <div className="list-group-item">
                {loadingPay && <div className="loader"></div>}
                <button className="btn btn-primary btn-block" onClick={payHandler}>
                  Pay with ATM Card
                </button>
              </div>
            )}

            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <div className="list-group-item">
                {loadingDeliver && <div className="loader"></div>}
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '1rem', backgroundColor: 'var(--success-color)' }}
                  onClick={deliverOrderHandler}
                >
                  Mark As Delivered
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
