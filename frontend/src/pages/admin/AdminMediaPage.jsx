import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadMediaMutation,
} from '../../slices/settingsApiSlice';

const AdminMediaPage = () => {
  const { data: settings, isLoading, error, refetch } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [banners, setBanners] = useState([]);
  const [music, setMusic] = useState('');

  useEffect(() => {
    if (settings) {
      setBanners(settings.banners || []);
      setMusic(settings.music || '');
    }
  }, [settings]);

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    try {
      const res = await uploadMedia(formData).unwrap();
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      const newBanner = {
        type,
        url: res.url,
        title: '',
        subtitle: '',
      };
      
      setBanners([...banners, newBanner]);
      toast.success('Banner media uploaded! Remember to save settings.');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    try {
      const res = await uploadMedia(formData).unwrap();
      setMusic(res.url);
      toast.success('Music uploaded! Remember to save settings.');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const removeBanner = (index) => {
    const newBanners = [...banners];
    newBanners.splice(index, 1);
    setBanners(newBanners);
  };

  const updateBannerText = (index, field, value) => {
    const newBanners = [...banners];
    newBanners[index][field] = value;
    setBanners(newBanners);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateSettings({
        banners,
        music,
      }).unwrap();
      toast.success('Settings updated successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error?.data?.message || error.error}</div>;

  return (
    <div className="admin-page-container">
      <h2>Media & Settings</h2>
      <form onSubmit={submitHandler}>
        
        <div className="admin-section" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Background Music</h3>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Current Music URL</label>
            <input
              type="text"
              value={music}
              onChange={(e) => setMusic(e.target.value)}
              placeholder="Enter music URL or upload below"
              className="form-control"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div className="form-group">
            <label>Upload New Music (mp3, wav)</label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleMusicUpload}
              className="form-control"
            />
            {isUploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
          </div>
          {music && (
            <div style={{ marginTop: '10px' }}>
              <audio src={music} controls />
            </div>
          )}
        </div>

        <div className="admin-section" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Banners</h3>
          <p>Add images or videos to display in the home page carousel.</p>
          
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Upload New Banner (image, video)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleBannerUpload}
              className="form-control"
            />
            {isUploading && <span style={{ marginLeft: '10px' }}>Uploading...</span>}
          </div>

          <div className="banners-list">
            {banners.map((banner, index) => (
              <div key={index} style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', padding: '15px', border: '1px solid #eee' }}>
                <div style={{ width: '150px' }}>
                  {banner.type === 'video' ? (
                    <video src={banner.url} style={{ width: '100%', borderRadius: '4px' }} controls />
                  ) : (
                    <img src={banner.url} alt="banner preview" style={{ width: '100%', borderRadius: '4px' }} />
                  )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                   <input
                      type="text"
                      placeholder="Title"
                      value={banner.title}
                      onChange={(e) => updateBannerText(index, 'title', e.target.value)}
                      style={{ padding: '8px' }}
                   />
                   <input
                      type="text"
                      placeholder="Subtitle"
                      value={banner.subtitle}
                      onChange={(e) => updateBannerText(index, 'subtitle', e.target.value)}
                      style={{ padding: '8px' }}
                   />
                </div>
                <div>
                  <button type="button" onClick={() => removeBanner(index)} style={{ padding: '8px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {banners.length === 0 && <p>No banners added.</p>}
          </div>
        </div>

        <button type="submit" disabled={isUpdating} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          {isUpdating ? 'Saving...' : 'Save All Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminMediaPage;
