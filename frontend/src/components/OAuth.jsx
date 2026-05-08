import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useGoogleMutation } from '../slices/usersApiSlice';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleAuth] = useGoogleMutation();

  const handleGoogleClick = async () => {
    if (!app) {
      toast.error('Firebase is not initialized. Please check your configuration.');
      return;
    }
    
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await googleAuth({
        name: resultsFromGoogle.user.displayName,
        email: resultsFromGoogle.user.email,
        photo: resultsFromGoogle.user.photoURL,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || 'Google Authentication failed');
    }
  };

  return (
    <button
      type="button"
      className="btn btn-outline-google btn-block"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginTop: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0.75rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={handleGoogleClick}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <FcGoogle size={22} />
      Continue with Google
    </button>
  );
};

export default OAuth;
