import React, { useState } from 'react';
import { useSendNotificationMutation } from '../../slices/notificationsApiSlice';
import toast from 'react-hot-toast';
import { FaBell, FaPaperPlane } from 'react-icons/fa';

const AdminNotificationPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('');

  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      toast.error('Please fill in at least title and message');
      return;
    }

    try {
      await sendNotification({ title, body, url }).unwrap();
      toast.success('Push notifications sent successfully!');
      setTitle('');
      setBody('');
      setUrl('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="broadcast-page">
      <h1><FaBell style={{marginRight: '10px'}} /> Send Push Notification</h1>
      <p className="subtitle">Send a mobile/desktop notification to all subscribed users.</p>

      <form onSubmit={submitHandler} className="broadcast-form">
        <div className="form-group">
          <label>Notification Title</label>
          <input 
            type="text" 
            placeholder="e.g. Congrats, Akash - you are eligible! 👀" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Message Body</label>
          <textarea 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            placeholder="e.g. Tap to know more 💰"
            rows="4"
            className="styled-textarea"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Redirect URL (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. /product/123 or https://google.com" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="actions-bar">
          <button type="submit" className="btn btn-primary send-btn" disabled={isLoading}>
            <FaPaperPlane style={{marginRight: '10px'}} /> {isLoading ? 'Sending...' : 'Send Push Notification'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNotificationPage;
