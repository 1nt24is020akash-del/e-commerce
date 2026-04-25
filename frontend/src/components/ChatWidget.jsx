import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation } from '../slices/chatApiSlice';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { io } from 'socket.io-client';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: messages, refetch } = useGetMessagesQuery(userInfo?._id, {
    skip: !userInfo
  });
  
  const [sendMessage] = useSendMessageMutation();
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

  if (!userInfo) return null;

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window card-glass">
          <div className="chat-header">
            <h3>Support Chat</h3>
            <button onClick={() => setIsOpen(false)}><FaTimes /></button>
          </div>
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
