import { useSendBroadcastEmailMutation } from '../../slices/usersApiSlice';
import toast from 'react-hot-toast';
import { FaTrash, FaImage, FaLink, FaVideo, FaBold, FaItalic, FaListUl } from 'react-icons/fa';

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
          <label>Email Body (HTML supported)</label>
          <div className="fake-toolbar">
            <button type="button" title="Bold"><FaBold /></button>
            <button type="button" title="Italic"><FaItalic /></button>
            <button type="button" title="List"><FaListUl /></button>
            <span className="divider"></span>
            <button type="button" title="Link"><FaLink /></button>
            <button type="button" title="Image"><FaImage /></button>
            <button type="button" title="Video"><FaVideo /></button>
          </div>
          <div className="editor-wrapper">
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Write your email here... You can use HTML like <b>, <img>, etc."
              rows="12"
              className="styled-textarea"
            ></textarea>
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
