import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../slices/chatApiSlice';
import { useSubmitQueryMutation } from '../slices/supportApiSlice';
import { FaComments, FaPaperPlane, FaTimes, FaQuestionCircle, FaUser, FaEnvelope } from 'react-icons/fa';
import { io } from 'socket.io-client';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'query'
  const [text, setText] = useState('');
  const [queryData, setQueryData] = useState({ subject: '', message: '' });
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: messages, refetch } = useGetMessagesQuery(userInfo?._id, {
    skip: !userInfo
  });
  
  const [sendMessage] = useSendMessageMutation();
  const [submitQuery, { isLoading: isSubmittingQuery }] = useSubmitQueryMutation();
  const scrollRef = useRef();

  useEffect(() => {
    if (userInfo) {
      const socket = io();
      socket.on('message', () => {
        refetch();
      });
      return () => socket.disconnect();
    }
  }, [userInfo, refetch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({ text }).unwrap();
      setText('');
    } catch (err) {
      console.error(err);
    }
  };

  const querySubmitHandler = async (e) => {
    e.preventDefault();
    try {
      await submitQuery({
        name: userInfo.name,
        email: userInfo.email,
        subject: queryData.subject || 'Support Request',
        message: queryData.message
      }).unwrap();
      setQueryData({ subject: '', message: '' });
      alert('Query submitted successfully! We will get back to you soon.');
      setActiveTab('chat');
    } catch (err) {
      alert(err?.data?.message || 'Failed to submit query');
    }
  };

  if (!userInfo) return null;

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window card-glass">
          <div className="chat-header">
            <div className="chat-tabs">
              <button 
                className={activeTab === 'chat' ? 'active' : ''} 
                onClick={() => setActiveTab('chat')}
              >
                <FaComments /> Chat
              </button>
              <button 
                className={activeTab === 'query' ? 'active' : ''} 
                onClick={() => setActiveTab('query')}
              >
                <FaQuestionCircle /> Queries
              </button>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="chat-messages">
                {messages?.map((m) => (
                  <div key={m._id} className={`message ${m.sender === userInfo._id ? 'sent' : 'received'}`}>
                    <div className="message-bubble">{m.text}</div>
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
              <form onSubmit={submitHandler} className="chat-input">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className="query-form-container">
              <form onSubmit={querySubmitHandler}>
                <div className="query-info">
                  <span><FaUser /> {userInfo.name}</span>
                  <span><FaEnvelope /> {userInfo.email}</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Subject (e.g. Order Issue)" 
                  value={queryData.subject}
                  required
                  onChange={(e) => setQueryData({...queryData, subject: e.target.value})}
                />
                <textarea 
                  placeholder="Describe your issue in detail..." 
                  rows="5"
                  value={queryData.message}
                  required
                  onChange={(e) => setQueryData({...queryData, message: e.target.value})}
                ></textarea>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingQuery}>
                  {isSubmittingQuery ? 'Submitting...' : 'Submit Query'}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          <FaComments />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
