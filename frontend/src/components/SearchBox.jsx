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
    <form onSubmit={submitHandler} style={{ flex: 1, margin: '0 2rem', position: 'relative' }}>
      <FaSearch style={{
        position: 'absolute',
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b',
        fontSize: '1.1rem'
      }} />
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search for Products, Brands and More"
        className="form-control flipkart-search"
        style={{ 
          width: '100%', 
          padding: '0.75rem 1rem 0.75rem 3rem', 
          borderRadius: '8px',
          background: '#f0f5ff',
          border: '1px solid transparent',
          transition: 'all 0.3s ease',
          fontSize: '0.95rem',
          color: '#334155'
        }}
      />
    </form>
  );
};

export default SearchBox;
