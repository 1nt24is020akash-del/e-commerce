import React, { useState, useEffect, useRef } from 'react';
import { useGetAnnouncementQuery, useUpdateAnnouncementMutation } from '../../slices/announcementApiSlice';
import { useGetChatUsersQuery, useGetMessagesQuery, useSendMessageMutation } from '../../slices/chatApiSlice';
import { FaPaperPlane, FaBullhorn, FaUser } from 'react-icons/fa';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminChatPage = () => {
  // Announcement State
  const [announcementMsg, setAnnouncementMsg] = useState('');
  const { data: announcement } = useGetAnnouncementQuery();
  const [updateAnnouncement, { isLoading: isUpdating }] = useUpdateAnnouncementMutation();

  // Chat State
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatText, setChatText] = useState('');
  const { data: chatUsers } = useGetChatUsersQuery();
  const { data: messages, refetch } = useGetMessagesQuery(selectedUser?._id, {
    skip: !selectedUser
  });
  const [sendMessage] = useSendMessageMutation();
  const scrollRef = useRef();

  useEffect(() => {
    if (announcement) setAnnouncementMsg(announcement.message);
  }, [announcement]);

  useEffect(() => {
    const socket = io();
    socket.on('message', () => {
      refetch();
    });
    return () => socket.disconnect();
  }, [refetch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const announcementHandler = async (e) => {
    e.preventDefault();
    try {
      await updateAnnouncement({ message: announcementMsg }).unwrap();
      toast.success('Announcement updated!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const chatHandler = async (e) => {
    e.preventDefault();
    if (!chatText.trim() || !selectedUser) return;
    try {
      await sendMessage({ text: chatText, receiverId: selectedUser._id }).unwrap();
      setChatText('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="admin-chat-page">
      <h1>Communication Center</h1>

      <section className="announcement-section card-glass">
        <h3><FaBullhorn /> Global Announcement Bar</h3>
        <form onSubmit={announcementHandler} className="flex-gap">
          <input 
            type="text" 
            placeholder="Update global offer/news..." 
            value={announcementMsg}
            onChange={(e) => setAnnouncementMsg(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={isUpdating}>
            Update for All Users
          </button>
        </form>
      </section>

      <div className="chat-dashboard">
        <aside className="user-list card-glass">
          <h3>Active Chats</h3>
          {chatUsers?.map(user => (
            <div 
              key={user._id} 
              className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <FaUser /> {user.name}
            </div>
          ))}
          {chatUsers?.length === 0 && <p className="empty">No active chats</p>}
        </aside>

        <main className="chat-area card-glass">
          {selectedUser ? (
            <>
              <div className="chat-header">
                Chatting with: <strong>{selectedUser.name}</strong>
              </div>
              <div className="chat-messages">
                {messages?.map(m => (
                  <div key={m._id} className={`message ${m.isAdmin ? 'sent' : 'received'}`}>
                    <div className="message-bubble">{m.text}</div>
                  </div>
                ))}
                <div ref={scrollRef}></div>
              </div>
              <form onSubmit={chatHandler} className="chat-input">
                <input 
                  type="text" 
                  placeholder="Type a reply..." 
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className="select-prompt">Select a user to start chatting</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminChatPage;
