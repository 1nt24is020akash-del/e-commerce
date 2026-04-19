import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    <form onSubmit={submitHandler} style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="form-control"
        style={{ width: '200px', padding: '0.4rem 0.8rem', borderRadius: '4px' }}
      />
      <button type="submit" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }}>
        Search
      </button>
    </form>
  );
};

export default SearchBox;
