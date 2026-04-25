import React, { useState, useEffect } from 'react';
import { useGetAnnouncementQuery } from '../slices/announcementApiSlice';
import { io } from 'socket.io-client';

const AnnouncementBar = () => {
  const { data: announcement, isLoading, refetch } = useGetAnnouncementQuery();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (announcement && announcement.isActive) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  useEffect(() => {
    const socket = io();
    socket.on('newAnnouncement', () => {
      refetch(); // Fetch the new message
      setIsVisible(true); // Show the bar
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    });
    return () => socket.disconnect();
  }, [refetch]);

  if (isLoading || !isVisible || !announcement || !announcement.isActive) return null;

  return (
    <div className="announcement-bar">
      <div className="container">
        <p>📢 {announcement.message}</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
