import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex-between" style={{marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto'}}>
      <div>{step1 ? <Link to="/login" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>Sign In</Link> : <span style={{color: 'var(--text-secondary)'}}>Sign In</span>}</div>
      <div>{step2 ? <Link to="/shipping" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>Shipping</Link> : <span style={{color: 'var(--text-secondary)'}}>Shipping</span>}</div>
      <div>{step3 ? <Link to="/payment" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>Payment</Link> : <span style={{color: 'var(--text-secondary)'}}>Payment</span>}</div>
      <div>{step4 ? <Link to="/placeorder" style={{color: 'var(--primary-color)', fontWeight: 'bold'}}>Place Order</Link> : <span style={{color: 'var(--text-secondary)'}}>Place Order</span>}</div>
    </nav>
  );
};

export default CheckoutSteps;
