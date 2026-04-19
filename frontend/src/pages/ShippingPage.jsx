import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="form-container">
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" placeholder="Enter address" value={address} required onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">City</label>
          <input type="text" className="form-control" placeholder="Enter city" value={city} required onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Postal Code</label>
          <input type="text" className="form-control" placeholder="Enter postal code" value={postalCode} required onChange={(e) => setPostalCode(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Country</label>
          <input type="text" className="form-control" placeholder="Enter country" value={country} required onChange={(e) => setCountry(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Continue</button>
      </form>
    </div>
  );
};

export default ShippingPage;
