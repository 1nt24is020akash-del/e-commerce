import React, { useState } from 'react';

const MockPaymentModal = ({ onClose, onSuccess, amount }) => {
  const [step, setStep] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 16 || cvv.length < 3 || expiry.length < 4) {
      setError('Please enter valid card details (16 digit card, valid expiry, 3 digit CVV)');
      return;
    }
    setError('');
    // Simulate sending OTP
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === '1234') {
      onSuccess();
    } else {
      setError('Invalid OTP. Please enter 1234 to simulate a successful payment.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Secure Payment Gateway</h2>
          <button onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>

        {error && <div className="alert alert-danger" style={{margin: '10px 0'}}>{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleCardSubmit} style={styles.form}>
            <div style={styles.amountBanner}>Total Payable: ₹{amount}</div>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Card Number</label>
              <input 
                type="text" 
                placeholder="XXXX XXXX XXXX XXXX" 
                maxLength="16"
                className="form-control"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                required 
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Expiry (MM/YY)</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  maxLength="5"
                  className="form-control"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>CVV</label>
                <input 
                  type="password" 
                  placeholder="XXX" 
                  maxLength="3"
                  className="form-control"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" style={{width: '100%'}}>
              Proceed to Pay
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} style={styles.form}>
            <div className="alert alert-success" style={{textAlign: 'center', marginBottom: '1rem'}}>
              An OTP has been sent to your registered mobile number.
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <label>Enter OTP</label>
              <p style={{fontSize: '0.8rem', color: '#666'}}>Hint: Enter 1234 to simulate success</p>
              <input 
                type="text" 
                placeholder="XXXX" 
                maxLength="4"
                className="form-control"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required 
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block" style={{width: '100%', backgroundColor: 'var(--success-color)'}}>
              Verify & Pay
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '8px',
    width: '90%', maxWidth: '450px',
    padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px'
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#555'
  },
  amountBanner: {
    backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px',
    textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', color: '#333'
  },
  form: {
    display: 'flex', flexDirection: 'column'
  }
};

export default MockPaymentModal;
