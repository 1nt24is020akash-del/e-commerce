import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Product from '../components/Product';
import BannerCarousel from '../components/BannerCarousel';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const categories = [
  'All Items',
  'Fruits',
  'Vegetables',
  'Clothes',
  'Food',
  'Snacks & Chats',
  'Electronics'
];

const HomePage = () => {
  const { keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'All Items';

  const { data: products, isLoading, error } = useGetProductsQuery({ keyword, category });

  const handleCategoryClick = (cat) => {
    if (cat === 'All Items') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      {!keyword && (
        <>
          <BannerCarousel />
          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-button ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </>
      )}
      
      {keyword && <a href="/" className="btn btn-outline" style={{marginBottom: '1.5rem', display: 'inline-block'}}>Go Back</a>}
      <h1 style={{ marginTop: keyword ? '0' : '1rem' }}>{keyword ? `Search Results for "${keyword}"` : 'Latest Products'}</h1>
      
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="alert alert-danger">{error?.data?.message || error.error}</div>
      ) : products.length === 0 ? (
        <div className="alert alert-info">No products found in this category.</div>
      ) : (
        <div className="grid grid-cols-4">
          {products.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </>
  );
};

export default HomePage;
