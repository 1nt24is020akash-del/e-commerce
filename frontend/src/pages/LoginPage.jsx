import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import OAuth from '../components/OAuth';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const calculateStrength = useCallback((pass) => {
    let s = 0;
    if (pass.length > 5) s++;
    if (pass.length > 8) s++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    setStrength(s);
  }, []);

  const onPasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    calculateStrength(val);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in successfully');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to login');
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
      <h1 className="gradient-text" style={{ marginBottom: '2rem', fontSize: '2.5rem', textAlign: 'center' }}>Sign In</h1>
      
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '2rem' }}>
          {error?.data?.message || error.error || 'An error occurred'}
        </div>
      )}
      
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={onPasswordChange}
            required
            autoComplete="current-password"
          />
          {password.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <div className="password-strength-meter">
                <div className={`strength-segment ${getStrengthClass(0)}`}></div>
                <div className={`strength-segment ${getStrengthClass(1)}`}></div>
                <div className={`strength-segment ${getStrengthClass(2)}`}></div>
              </div>
              <span className="password-text" style={{ color: strength <= 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : '#10b981' }}>
                {getStrengthText()}
              </span>
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-block" 
          disabled={isLoading} 
          style={{ marginTop: '1.5rem' }}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="divider" style={{ margin: '2rem 0', textAlign: 'center', position: 'relative' }}>
          <span style={{ background: 'var(--card-bg)', padding: '0 15px', color: 'var(--text-secondary)', fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>OR</span>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--card-border)', zIndex: 0 }}></div>
        </div>

        <OAuth />
      </form>

      <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '1rem', color: 'var(--text-secondary)' }}>
        New Customer?{' '}
        <Link to={redirect !== '/' ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--primary-color)', fontWeight: '700', textDecoration: 'none' }}>
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;

