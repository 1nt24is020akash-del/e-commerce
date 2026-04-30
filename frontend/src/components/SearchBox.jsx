import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch, FaMicrophone } from 'react-icons/fa';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');
  const [isListening, setIsListening] = useState(false);

  const submitHandler = (e) => {
    if (e) e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support voice search.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
      setIsListening(false);
      // Auto-submit after voice recognition
      setTimeout(() => {
        navigate(`/search/${transcript}`);
      }, 500);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <form onSubmit={submitHandler} className="search-form">
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search for products, brands and more..."
          className="form-control search-input"
        />
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          title="Voice Search"
        >
          <FaMicrophone />
        </button>
      </div>
      <button type="submit" className="btn btn-search-big">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
