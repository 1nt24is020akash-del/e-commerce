import React from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation, useSeedProductsMutation } from '../../slices/productsApiSlice';

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [seedProducts, { isLoading: loadingSeed }] = useSeedProductsMutation();
  const [selectedCategory, setSelectedCategory] = React.useState('All Items');

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

      {!isLoading && !error && (
        <div className="category-filter-bar card-glass" style={{
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2.5rem', 
          padding: '1.25rem', 
          borderRadius: '15px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none'
        }}>
          {['All Items', ...new Set(products.map(p => p.category))].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{
                borderRadius: '30px',
                padding: '0.6rem 1.8rem',
                fontSize: '0.9rem',
                minWidth: 'fit-content'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? <div className="loader"></div> : error ? <div className="alert alert-danger">{error.data?.message}</div> : (
        <div className="product-admin-sections">
          {Object.entries(
            products
              .filter(p => selectedCategory === 'All Items' || p.category === selectedCategory)
              .reduce((acc, product) => {
              const category = product.category || 'Other';
              if (!acc[category]) acc[category] = [];
              acc[category].push(product);
              return acc;
            }, {})
          ).map(([category, categoryProducts]) => (
            <div key={category} className="category-section card-glass" style={{marginBottom: '3rem', padding: '1.5rem', borderRadius: '15px'}}>
              <h2 style={{
                marginBottom: '1.5rem', 
                color: 'var(--primary-color)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                borderBottom: '2px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.5rem'
              }}>
                {category === 'Fruits' ? '🍎' : category === 'Vegetables' ? '🥦' : category === 'Snacks & Chats' ? '🍿' : category === 'Electronics' ? '💻' : '📦'} {category} 
                <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-secondary)'}}>({categoryProducts.length} items)</span>
              </h2>
              <div style={{overflowX: 'auto'}}>
                <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                      <th style={{padding: '1rem 0.5rem'}}>ID</th>
                      <th style={{padding: '1rem 0.5rem'}}>NAME</th>
                      <th style={{padding: '1rem 0.5rem'}}>PRICE</th>
                      <th style={{padding: '1rem 0.5rem'}}>BRAND</th>
                      <th style={{padding: '1rem 0.5rem'}}>STOCK</th>
                      <th style={{padding: '1rem 0.5rem'}}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryProducts.map((product) => (
                      <tr key={product._id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <td style={{padding: '1rem 0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{product._id.substring(0, 8)}...</td>
                        <td style={{padding: '1rem 0.5rem', fontWeight: '500'}}>{product.name}</td>
                        <td style={{padding: '1rem 0.5rem'}}>₹{product.price}</td>
                        <td style={{padding: '1rem 0.5rem'}}>{product.brand}</td>
                        <td style={{padding: '1rem 0.5rem'}}>
                          <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                            {product.countInStock}
                          </span>
                        </td>
                        <td style={{padding: '1rem 0.5rem'}}>
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <Link to={`/admin/product/${product._id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                            <button className="btn btn-outline btn-sm" onClick={() => deleteHandler(product._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductListPage;
