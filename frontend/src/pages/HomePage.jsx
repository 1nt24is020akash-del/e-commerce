import React from 'react';
import { useParams } from 'react-router-dom';
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomePage = () => {
  const { keyword } = useParams();
  const { data: products, isLoading, error } = useGetProductsQuery(keyword);

  return (
    <>
      {keyword && <a href="/" className="btn btn-outline" style={{marginBottom: '1.5rem', display: 'inline-block'}}>Go Back</a>}
      <h1>{keyword ? `Search Results for "${keyword}"` : 'Latest Products'}</h1>
      {isLoading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="alert alert-danger">{error?.data?.message || error.error}</div>
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
