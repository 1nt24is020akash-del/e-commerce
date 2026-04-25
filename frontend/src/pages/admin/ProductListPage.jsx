import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation, useSeedProductsMutation } from '../../slices/productsApiSlice';

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [seedProducts, { isLoading: loadingSeed }] = useSeedProductsMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const seedProductsHandler = async () => {
    if (window.confirm('This will reset the entire product list to the latest Flipkart-inspired collection. Continue?')) {
      try {
        await seedProducts().unwrap();
        refetch();
        alert('Products restored successfully!');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <div className="flex-between" style={{marginBottom: '1.5rem'}}>
        <h1>Products</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button className="btn btn-outline" onClick={seedProductsHandler} disabled={loadingSeed}>
            {loadingSeed ? 'Restoring...' : 'Restore All Products'}
          </button>
          <button className="btn btn-primary" onClick={createProductHandler}>Create Product</button>
        </div>
      </div>

      {loadingCreate && <div className="loader"></div>}
      {loadingDelete && <div className="loader"></div>}

      {isLoading ? <div className="loader"></div> : error ? <div className="alert alert-danger">{error.data?.message}</div> : (
        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{borderBottom: '1px solid var(--border-color)'}}>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} style={{borderBottom: '1px solid var(--border-color)'}}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`} className="btn btn-outline" style={{marginRight: '0.5rem'}}>Edit</Link>
                  <button className="btn btn-outline" onClick={() => deleteHandler(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ProductListPage;
