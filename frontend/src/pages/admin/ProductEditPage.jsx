import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../slices/productsApiSlice';

const ProductEditPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [discount, setDiscount] = useState(0);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setColor(product.color || '');
      setIsNewArrival(product.isNewArrival || false);
      setDiscount(product.discount || 0);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        color,
        isNewArrival,
        discount,
      }).unwrap();
      alert('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-outline" style={{marginBottom: '1.5rem'}}>
        Go Back
      </Link>
      <div className="form-container">
        <h1>Edit Product</h1>
        {loadingUpdate && <div className="loader"></div>}
        {isLoading ? (
          <div className="loader"></div>
        ) : error ? (
          <div className="alert alert-danger">{error.data?.message}</div>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Count In Stock</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Percentage</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                id="isNewArrival"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
              />
              <label htmlFor="isNewArrival" className="form-label" style={{marginBottom: 0}}>Mark as New Arrival</label>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{minHeight: '100px'}}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
            >
              Update
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default ProductEditPage;
