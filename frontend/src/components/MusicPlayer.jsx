import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useGetSettingsQuery } from '../slices/settingsApiSlice';

const MusicPlayer = () => {
  const { data: settings } = useGetSettingsQuery();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const musicUrl = settings?.music || "/music/background.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Autoplay blocked by browser. User interaction required.");
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  if (!settings && !musicUrl) return null;

  return (
    <div className="music-player-controls-only">
      <audio ref={audioRef} src={musicUrl} loop autoPlay />
      <div className="music-controls">
        <button onClick={togglePlay} className="music-btn play-btn" title={isPlaying ? 'Pause Music' : 'Play Music'}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <div className="music-info">
          <span className="music-title">Enjoyable Beats</span>
          <div className="music-visualizer">
            <div className={`bar ${isPlaying ? 'playing' : ''}`}></div>
            <div className={`bar ${isPlaying ? 'playing' : ''}`}></div>
            <div className={`bar ${isPlaying ? 'playing' : ''}`}></div>
          </div>
        </div>

        <div className="volume-control">
          <button onClick={toggleMute} className="music-btn" title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={handleVolumeChange} 
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
