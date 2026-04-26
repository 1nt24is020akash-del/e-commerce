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
    <form onSubmit={submitHandler} className="search-form" style={{ display: 'flex', alignItems: 'center', gap: '0', flex: 2, maxWidth: '800px' }}>
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
        <FaSearch style={{ position: 'absolute', left: '1.2rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }} />
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Search for products, brands and more..."
          className="form-control search-input"
          style={{ 
            padding: '1rem 1rem 1rem 3.5rem',
            borderRadius: '12px 0 0 12px',
            border: '2px solid var(--card-border)',
            borderRight: 'none',
            width: '100%',
            fontSize: '1.1rem',
            background: 'var(--card-bg)',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
      <button type="submit" className="btn btn-search-big" style={{
        borderRadius: '0 12px 12px 0',
        padding: '1.05rem 2.5rem',
        fontSize: '1.1rem',
        background: 'var(--button-gradient)',
        color: 'white',
        border: 'none',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)'
      }}>
        Search
      </button>
    </form>
  );
};

export default SearchBox;
