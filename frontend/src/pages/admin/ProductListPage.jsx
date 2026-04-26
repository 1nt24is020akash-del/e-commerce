import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  useGetProductsQuery, 
  useCreateProductMutation, 
  useDeleteProductMutation, 
  useSeedProductsMutation,
  useDeleteProductsMutation,
  useCreateMultipleProductsMutation
} from '../../slices/productsApiSlice';
import { FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';

const ProductListPage = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [deleteProducts, { isLoading: loadingBulkDelete }] = useDeleteProductsMutation();
  const [createMultipleProducts, { isLoading: loadingBulkCreate }] = useCreateMultipleProductsMutation();
  const [seedProducts, { isLoading: loadingSeed }] = useSeedProductsMutation();
  
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [selectedIds, setSelectedIds] = useState([]);
  
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  // Modal states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [bulkItems, setBulkItems] = useState([{ name: '', price: '', brand: '', countInStock: '', image: '' }]);

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
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const deleteSelectedHandler = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
      try {
        await deleteProducts(selectedIds).unwrap();
        setSelectedIds([]);
        refetch();
        alert('Selected products deleted successfully');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const seedProductsHandler = async () => {
    if (window.confirm('This will reset the entire product list. Continue?')) {
      try {
        await seedProducts().unwrap();
        refetch();
        alert('Products restored successfully!');
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (categoryProducts) => {
    const categoryIds = categoryProducts.map(p => p._id);
    const allSelected = categoryIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !categoryIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...categoryIds])]);
    }
  };

  const addBulkRow = () => {
    setBulkItems([...bulkItems, { name: '', price: '', brand: '', countInStock: '' }]);
  };

  const removeBulkRow = (index) => {
    setBulkItems(bulkItems.filter((_, i) => i !== index));
  };

  const updateBulkItem = (index, field, value) => {
    const updated = [...bulkItems];
    updated[index][field] = value;
    setBulkItems(updated);
  };

  const uploadFileHandler = async (e, index) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      updateBulkItem(index, 'image', res.image);
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName) return alert('Please enter a category name');
    
    const productsToCreate = bulkItems.filter(item => item.name && item.price).map(item => ({
      ...item,
      category: newCategoryName,
      price: Number(item.price),
      countInStock: Number(item.countInStock) || 0
    }));

    if (productsToCreate.length === 0) return alert('Please fill in at least one product name and price');

    try {
      await createMultipleProducts(productsToCreate).unwrap();
      setShowBulkModal(false);
      setBulkItems([{ name: '', price: '', brand: '', countInStock: '' }]);
      setNewCategoryName('');
      refetch();
      alert('Products created successfully!');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <div className="flex-between" style={{marginBottom: '1.5rem'}}>
        <h1>Products</h1>
        <div style={{display: 'flex', gap: '1rem'}}>
          {selectedIds.length > 0 && (
            <button className="btn btn-outline" onClick={deleteSelectedHandler} style={{borderColor: 'var(--danger-color)', color: 'var(--danger-color)'}} disabled={loadingBulkDelete}>
              <FaTrash style={{marginRight: '0.5rem'}} /> Delete Selected ({selectedIds.length})
            </button>
          )}
          <button className="btn btn-outline" onClick={seedProductsHandler} disabled={loadingSeed}>
            {loadingSeed ? 'Restoring...' : 'Restore All Products'}
          </button>
          <button className="btn btn-outline" onClick={() => setShowBulkModal(true)} style={{borderColor: 'var(--accent-color)', color: 'var(--accent-color)'}}>
            <FaPlus style={{marginRight: '0.5rem'}} /> New Category & Bulk Add
          </button>
          <button className="btn btn-primary" onClick={createProductHandler}>Create Product</button>
        </div>
      </div>

      {(loadingCreate || loadingDelete || loadingBulkDelete || loadingBulkCreate || loadingSeed) && <div className="loader"></div>}

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
          ).map(([category, categoryProducts]) => {
            const isAllSelected = categoryProducts.every(p => selectedIds.includes(p._id));
            return (
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
                        <th style={{padding: '1rem 0.5rem', width: '40px'}}>
                          <input 
                            type="checkbox" 
                            checked={isAllSelected} 
                            onChange={() => toggleSelectAll(categoryProducts)}
                            style={{cursor: 'pointer'}}
                          />
                        </th>
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
                        <tr key={product._id} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          backgroundColor: selectedIds.includes(product._id) ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                        }}>
                          <td style={{padding: '1rem 0.5rem'}}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.includes(product._id)} 
                              onChange={() => toggleSelect(product._id)}
                              style={{cursor: 'pointer'}}
                            />
                          </td>
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
            );
          })}
        </div>
      )}

      {/* Bulk Create Modal */}
      {showBulkModal && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal} className="card-glass">
            <div style={modalStyles.header}>
              <h2>New Category & Bulk Product Creation</h2>
              <button onClick={() => setShowBulkModal(false)} style={modalStyles.closeBtn}>&times;</button>
            </div>
            <form onSubmit={handleBulkSubmit}>
              <div className="form-group" style={{marginBottom: '1.5rem'}}>
                <label>Category Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g., Home Decor, Accessories..." 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>

              <div style={{maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>IMAGE (URL or Upload)</th>
                      <th>BRAND</th>
                      <th>STOCK</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkItems.map((item, index) => (
                      <tr key={index}>
                        <td><input type="text" className="form-control" style={{padding: '0.5rem'}} value={item.name} onChange={(e) => updateBulkItem(index, 'name', e.target.value)} placeholder="Name" /></td>
                        <td><input type="number" className="form-control" style={{padding: '0.5rem'}} value={item.price} onChange={(e) => updateBulkItem(index, 'price', e.target.value)} placeholder="Price" /></td>
                        <td>
                          <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                            <input 
                              type="text" 
                              className="form-control" 
                              style={{padding: '0.5rem', flex: 1}} 
                              value={item.image} 
                              onChange={(e) => updateBulkItem(index, 'image', e.target.value)} 
                              placeholder="URL" 
                            />
                            <label style={{cursor: 'pointer', color: 'var(--primary-color)', fontSize: '1.2rem'}} title="Upload Image">
                              <FaPlus />
                              <input type="file" hidden onChange={(e) => uploadFileHandler(e, index)} />
                            </label>
                            {item.image && <FaCheck style={{color: 'var(--success-color)'}} />}
                          </div>
                        </td>
                        <td><input type="text" className="form-control" style={{padding: '0.5rem'}} value={item.brand} onChange={(e) => updateBulkItem(index, 'brand', e.target.value)} placeholder="Brand" /></td>
                        <td><input type="number" className="form-control" style={{padding: '0.5rem'}} value={item.countInStock} onChange={(e) => updateBulkItem(index, 'countInStock', e.target.value)} placeholder="0" /></td>
                        <td>
                          {bulkItems.length > 1 && (
                            <button type="button" onClick={() => removeBulkRow(index)} style={{background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer'}}>
                              <FaTimes />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button type="button" className="btn btn-outline btn-block" onClick={addBulkRow} style={{marginBottom: '1rem', width: '100%'}}>
                <FaPlus style={{marginRight: '0.5rem'}} /> Add Another Product
              </button>

              <button type="submit" className="btn btn-primary btn-block" style={{width: '100%'}} disabled={loadingBulkCreate}>
                {loadingBulkCreate ? 'Creating Products...' : `Create All Products for "${newCategoryName || '...'}"`}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)'
  },
  modal: {
    backgroundColor: 'var(--bg-color)', 
    borderRadius: '20px',
    width: '95%', maxWidth: '800px',
    padding: '2rem', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid var(--card-border)'
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem'
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-secondary)'
  }
};

export default ProductListPage;
