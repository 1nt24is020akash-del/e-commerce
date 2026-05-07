import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import OAuth from '../components/OAuth';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [strength, setStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const calculateStrength = (pass) => {
    let s = 0;
    if (pass.length > 5) s++;
    if (pass.length > 8) s++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    setStrength(s);
  };

  const onPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    calculateStrength(val);
  };

  const onPhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (phone.length !== 10) {
      alert('Phone number must be 10 digits');
      return;
    }
    try {
      const res = await register({ name, email, password, phone }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      console.error(err?.data?.message || err.error);
    }
  };

  const getStrengthClass = (index) => {
    if (strength === 0) return '';
    if (strength === 1) return index === 0 ? 'strength-weak' : '';
    if (strength === 2) return index <= 1 ? 'strength-medium' : '';
    if (strength >= 3) return 'strength-strong';
    return '';
  };

  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (strength <= 1) return 'Weak';
    if (strength === 2) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="form-container">
      <h1 className="gradient-text" style={{marginBottom: '2rem', fontSize: '2.5rem'}}>Sign Up</h1>
      {error && <div className="alert alert-danger">{error?.data?.message || error.error}</div>}
      
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Phone Number (WhatsApp)</label>
          <input
            type="text"
            className="form-control"
            placeholder="10-digit phone number"
            value={phone}
            onChange={onPhoneChange}
            required
          />
          <small style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>{phone.length}/10 digits</small>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={onPasswordChange}
            required
          />
          {password.length > 0 && (
            <>
              <div className="password-strength-meter">
                <div className={`strength-segment ${getStrengthClass(0)}`}></div>
                <div className={`strength-segment ${getStrengthClass(1)}`}></div>
                <div className={`strength-segment ${getStrengthClass(2)}`}></div>
              </div>
              <span className="password-text" style={{ color: strength <= 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : '#10b981' }}>
                {getStrengthText()}
              </span>
            </>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading} style={{marginTop: '1rem'}}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <div className="divider" style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
          <span style={{ background: 'var(--card-bg)', padding: '0 10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>OR</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: -1 }}></div>
        </div>

        <OAuth />
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.95rem' }}>
        Already have an account?{' '}
        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
