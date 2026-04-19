import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-img-wrapper">
        <img src={product.image} alt={product.name} className="product-img" />
      </Link>
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3 className="product-title">{product.name}</h3>
        </Link>
        <div className="product-rating">
          <span>⭐ {product.rating}</span>
          <span className="rating-text">({product.numReviews} reviews)</span>
        </div>
        <div className="product-price">₹{product.price}</div>
      </div>
    </div>
  );
};

export default Product;
