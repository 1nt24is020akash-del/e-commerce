import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Product from '../components/Product';
import BannerCarousel from '../components/BannerCarousel';
import FilterBar from '../components/FilterBar';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomePage = () => {
  const { keyword } = useParams();
  const [searchParams] = useSearchParams();
  
  const category = searchParams.get('category') || 'All Items';
  const sort = searchParams.get('sort') || '';
  const brand = searchParams.get('brand') || '';
  const color = searchParams.get('color') || '';
  const rating = searchParams.get('rating') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const discount = searchParams.get('discount') || '';

  const { data: products, isLoading, error } = useGetProductsQuery({ 
    keyword, 
    category,
    sort,
    brand,
    color,
    rating,
    isNewArrival,
    discount
  });

  return (
    <>
      {!keyword && <BannerCarousel />}
      
      {keyword && <a href="/" className="btn btn-outline" style={{marginBottom: '1.5rem', display: 'inline-block'}}>Go Back</a>}
      
      <div className="home-header">
        <h1 style={{ marginTop: keyword ? '0' : '1rem' }}>
          {keyword ? `Search Results for "${keyword}"` : category !== 'All Items' ? category : 'Latest Products'}
        </h1>
        <FilterBar />
      </div>
      
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="alert alert-danger">{error?.data?.message || error.error}</div>
      ) : !products || products.length === 0 ? (
        <div className="alert alert-info">No products found matching your criteria.</div>
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
