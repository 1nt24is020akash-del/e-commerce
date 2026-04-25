import React, { useState } from 'react';
import { useSendBroadcastEmailMutation } from '../../slices/usersApiSlice';
import toast from 'react-hot-toast';

const AdminBroadcastPage = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(false);

  const [sendEmail, { isLoading }] = useSendBroadcastEmailMutation();

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
          <label>Email Body (HTML supported)</label>
          <div className="editor-container">
            <textarea 
              rows="15" 
              placeholder="Enter your message here. You can use HTML tags like <img>, <h1>, <p>, etc." 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            
            <div className="help-box">
              <h3>💡 Tips for Media:</h3>
              <ul>
                <li><strong>Image:</strong> <code>&lt;img src="URL" style="max-width:100%" /&gt;</code></li>
                <li><strong>Video Link:</strong> <code>&lt;a href="URL"&gt;Watch Video&lt;/a&gt;</code></li>
                <li><strong>Bold Text:</strong> <code>&lt;strong&gt;Text&lt;/strong&gt;</code></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="actions">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => setPreview(!preview)}
          >
            {preview ? 'Edit Message' : 'Preview HTML'}
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send to All Users'}
          </button>
        </div>
      </form>

      {preview && (
        <div className="preview-section">
          <h2>Email Preview</h2>
          <div 
            className="preview-content" 
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AdminBroadcastPage;
