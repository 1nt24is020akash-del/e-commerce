import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="search-form" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="form-control"
        style={{ 
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          width: '100%'
        }}
      />
      <button type="submit" className="btn btn-search">
        Search
      </button>
    </form>
  );
};

export default SearchBox;
