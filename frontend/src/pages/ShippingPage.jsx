import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '');
  const [loadingLocation, setLoadingLocation] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLocationHandler = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data.address) {
            const addr = [
              data.address.road || '',
              data.address.suburb || '',
              data.address.neighbourhood || ''
            ].filter(Boolean).join(', ');
            
            setAddress(addr || data.display_name);
            setCity(data.address.city || data.address.town || data.address.village || '');
            setPostalCode(data.address.postcode || '');
            setCountry(data.address.country || '');
          }
        } catch (error) {
          console.error('Location error:', error);
          alert('Failed to get address. Please enter manually.');
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        alert('Location permission denied or unavailable.');
      }
    );
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phoneNumber }));
    navigate('/payment');
  };

  return (
    <div className="form-container">
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className="location-detector" style={{ marginBottom: '1.5rem' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={getLocationHandler}
            disabled={loadingLocation}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
          >
            <FaMapMarkerAlt /> {loadingLocation ? 'Detecting Location...' : 'Use My Current Location'}
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <div style={{ position: 'relative' }}>
            <FaPhoneAlt style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input 
              type="tel" 
              className="form-control" 
              placeholder="Enter phone number" 
              style={{ paddingLeft: '45px' }}
              value={phoneNumber} 
              required 
              onChange={(e) => setPhoneNumber(e.target.value)} 
            />
          </div>
        </div>

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
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1.1rem' }}>
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
