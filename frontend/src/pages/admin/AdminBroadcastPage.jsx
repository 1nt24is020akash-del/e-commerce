import React, { useState } from 'react';
import { useSendBroadcastEmailMutation } from '../../slices/usersApiSlice';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaTrash } from 'react-icons/fa';

const AdminBroadcastPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [sendEmail, { isLoading }] = useSendBroadcastEmailMutation();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const clearHandler = () => {
    if (window.confirm('Clear all content?')) {
      setSubject('');
      setMessage('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    if (window.confirm('Are you sure you want to send this email to ALL registered users?')) {
      try {
        await sendEmail({ subject, message }).unwrap();
        toast.success('Broadcast emails sent successfully!');
        setSubject('');
        setMessage('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="broadcast-page">
      <h1>Broadcast Email to Users</h1>
      <p className="subtitle">Send news, offers, or updates to all registered customers.</p>

      <form onSubmit={submitHandler} className="broadcast-form">
        <div className="form-group">
          <label>Email Subject</label>
          <input 
            type="text" 
            placeholder="e.g. Summer Sale is Here! ☀️" 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email Body</label>
          <div className="editor-wrapper">
            <ReactQuill 
              theme="snow" 
              value={message} 
              onChange={setMessage} 
              modules={modules}
              placeholder="Write your email here..."
            />
          </div>
        </div>

        <div className="actions-bar">
          <div className="main-actions">
            <button type="submit" className="btn btn-primary send-btn" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send'}
            </button>
            <button 
              type="button" 
              className="btn-icon-only delete-btn" 
              onClick={clearHandler}
              title="Clear all"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminBroadcastPage;
