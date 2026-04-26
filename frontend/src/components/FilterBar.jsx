import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSortAmountDown, FaFilter, FaStar, FaTags, FaFire } from 'react-icons/fa';

const FilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (key, value) => {
    if (value === '' || value === null) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };

  const currentSort = searchParams.get('sort') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentColor = searchParams.get('color') || '';
  const currentRating = searchParams.get('rating') || '';
  const isNewArrival = searchParams.get('isNewArrival') === 'true';
  const currentDiscount = searchParams.get('discount') || '';

  const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG'];
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Silver'];
  const discounts = [70, 60, 50, 40, 30];

  return (
    <div className="filter-bar-container">
      <div className="filter-section">
        <div className="filter-group">
          <label><FaSortAmountDown /> Sort</label>
          <select 
            value={currentSort} 
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="filter-select"
          >
            <option value="">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popularity">Popularity (Rating)</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        <div className="filter-group">
          <label><FaFilter /> Brand</label>
          <select 
            value={currentBrand} 
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="filter-select"
          >
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="filter-group">
          <label><FaStar /> Rating</label>
          <select 
            value={currentRating} 
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Colour</label>
          <select 
            value={currentColor} 
            onChange={(e) => handleFilterChange('color', e.target.value)}
            className="filter-select"
          >
            <option value="">All Colours</option>
            {colors.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button 
          className={`filter-btn ${isNewArrival ? 'active' : ''}`}
          onClick={() => handleFilterChange('isNewArrival', isNewArrival ? '' : 'true')}
        >
          <FaFire /> New Arrivals
        </button>

        <div className="discount-section">
          <label><FaTags /> Discount</label>
          <div className="discount-btns">
            {discounts.map(d => (
              <button 
                key={d}
                className={`discount-btn ${currentDiscount === d.toString() ? 'active' : ''}`}
                onClick={() => handleFilterChange('discount', currentDiscount === d.toString() ? '' : d.toString())}
              >
                {d}%+
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
