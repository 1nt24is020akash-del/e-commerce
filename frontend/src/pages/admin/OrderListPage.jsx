import React from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { FaTimes } from 'react-icons/fa';

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? <div className="loader"></div> : error ? <div className="alert alert-danger">{error.data?.message}</div> : (
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>₹{order.totalPrice}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : <FaTimes color="red" />}</td>
                <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : <FaTimes color="red" />}</td>
                <td><Link to={`/order/${order._id}`} className="btn btn-outline">Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OrderListPage;
