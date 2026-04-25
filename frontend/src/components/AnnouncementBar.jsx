import React from 'react';
import { useGetAnnouncementQuery } from '../slices/announcementApiSlice';

const AnnouncementBar = () => {
  const { data: announcement, isLoading } = useGetAnnouncementQuery();

  if (isLoading || !announcement || !announcement.isActive) return null;

  return (
    <div className="announcement-bar">
      <div className="container">
        <p>📢 {announcement.message}</p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
