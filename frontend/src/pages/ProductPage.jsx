import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductPage = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) return <div className="loader"></div>;
  if (error) return <div className="alert alert-danger">{error?.data?.message || error.error}</div>;

  return (
    <>
      <Link className="btn btn-outline" to="/" style={{ marginBottom: '1.5rem' }}>
        Go Back
      </Link>
      <div className="product-details">
        <div className="product-img-wrapper" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <img src={product.image} alt={product.name} className="product-img" />
        </div>
        <div>
          <h2>{product.name}</h2>
          <div className="product-rating">
            <span>⭐ {product.rating}</span>
            <span className="rating-text">({product.numReviews} reviews)</span>
          </div>
          <p style={{ margin: '1rem 0' }}>{product.description}</p>
        </div>
        <div className="list-group">
          <div className="list-group-item flex-between">
            <span>Price:</span>
            <strong>${product.price}</strong>
          </div>
          <div className="list-group-item flex-between">
            <span>Status:</span>
            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</strong>
          </div>
          {product.countInStock > 0 && (
            <div className="list-group-item flex-between">
              <span>Qty:</span>
              <select
                className="form-control"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                style={{ width: 'auto', padding: '0.25rem 0.5rem' }}
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="list-group-item">
            <button
              className="btn btn-primary btn-block"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
