import React, { useState } from 'react';
import { useSubmitQueryMutation } from '../slices/supportApiSlice';
import { useSelector } from 'react-redux';
import { BiSupport } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

const SupportBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);
  const [submitQuery, { isLoading }] = useSubmitQueryMutation();

  const toggleBox = () => {
    setIsOpen(!isOpen);
    if (!isOpen && userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await submitQuery({ name, email, message }).unwrap();
      setSuccess(true);
      setMessage('');
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="support-wrapper">
      <button className="support-fab" onClick={toggleBox}>
        {isOpen ? <IoClose size={24} /> : <BiSupport size={24} />}
      </button>

      {isOpen && (
        <div className="support-box card-glass">
          <div className="support-header">
            <h3>How can we help?</h3>
            <p>Send us a message and we'll get back to you.</p>
          </div>

          {success ? (
            <div className="support-success">
              <div className="success-icon">✓</div>
              <p>Message sent successfully!</p>
            </div>
          ) : (
            <form onSubmit={submitHandler} className="support-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Tell us about your problem..."
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SupportBox;
