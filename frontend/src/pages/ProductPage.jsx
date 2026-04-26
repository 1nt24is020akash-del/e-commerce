import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery, useGetProductsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { FaShareAlt, FaTruck, FaUndo, FaMoneyBillWave, FaCheckCircle, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const { data: allProducts } = useGetProductsQuery();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) return <div className="loader"></div>;
  if (error) return <div className="alert alert-danger">{error?.data?.message || error.error}</div>;

  const similarProducts = allProducts 
    ? allProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4)
    : [];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Product link copied to clipboard!');
  };

  // Mock rating if none exists
  const displayRating = product.rating || (4 + Math.random()).toFixed(1);
  const displayReviews = product.numReviews || Math.floor(Math.random() * 100) + 10;

  return (
    <>
      <Link className="btn btn-outline" to="/" style={{ marginBottom: '1.5rem' }}>
        Go Back
      </Link>
      <div className="product-details">
        <div className="product-img-column">
          <div 
            className="product-img-wrapper card-glass" 
            onClick={() => setIsLightboxOpen(true)}
            style={{ cursor: 'zoom-in', position: 'relative' }}
          >
            <img src={product.image} alt={product.name} className="product-img" />
            <button className="share-btn" onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}>
              <FaShareAlt />
            </button>
          </div>
          
          <div className="delivery-box card-glass">
            <div className="delivery-header">
              <FaTruck /> <span>Delivery Details</span>
            </div>
            <div className="delivery-info">
              <p><strong>Deliver to:</strong> 400001, Mumbai</p>
              <p className="delivery-time">Estimated delivery by 5 to 6 days</p>
            </div>
            <div className="policy-icons">
              <div className="policy-item"><FaUndo /> <span>7 Days Replacement</span></div>
              <div className="policy-item"><FaMoneyBillWave /> <span>COD Available</span></div>
            </div>
          </div>
        </div>

        <div className="product-info-column">
          <div className="assured-badge">
            <FaCheckCircle /> <span>MERN E-Shop Assured</span>
          </div>
          <h2 className="product-title-large">{product.name}</h2>
          <div className="product-rating-large">
            <div className="rating-stars">
              <FaStar /> <span>{displayRating}</span>
            </div>
            <span className="rating-text">({displayReviews} reviews)</span>
          </div>
          
          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="amount">{product.price}</span>
            <span className="mrp">₹{Math.floor(product.price * 1.3)}</span>
            <span className="discount">30% OFF</span>
          </div>

          <p className="product-desc">{product.description}</p>
          
          <div className="highlights">
            <h4>Key Features:</h4>
            <ul>
              <li>Premium Quality Material</li>
              <li>MERN E-Shop Certified</li>
              <li>Free Shipping across India</li>
            </ul>
          </div>
        </div>

        <div className="action-column">
          <div className="list-group card-glass">
            <div className="list-group-item flex-between">
              <span>Price:</span>
              <strong className="text-primary">₹{product.price}</strong>
            </div>
            <div className="list-group-item flex-between">
              <span>Status:</span>
              <strong className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </strong>
            </div>
            {product.countInStock > 0 && (
              <div className="list-group-item flex-between">
                <span>Qty:</span>
                <select
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  style={{ width: '80px', padding: '0.4rem' }}
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
                style={{ padding: '1rem' }}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="similar-products-section" style={{ marginTop: '5rem' }}>
          <h2 className="gradient-text">Similar Products</h2>
          <div className="grid grid-cols-4">
            {similarProducts.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="product-card card-glass">
                <div className="product-img-wrapper">
                  <img src={p.image} alt={p.name} className="product-img" />
                </div>
                <div className="product-info">
                  <h3 className="product-title" style={{fontSize: '0.9rem'}}>{p.name}</h3>
                  <div className="flex-between">
                    <span className="product-price" style={{fontSize: '1.1rem'}}>₹{p.price}</span>
                    <span className="product-rating" style={{margin: 0}}><FaStar /> {p.rating || (4 + Math.random()).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={product.image} alt={product.name} />
            <button className="close-lightbox" onClick={() => setIsLightboxOpen(false)}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductPage;
