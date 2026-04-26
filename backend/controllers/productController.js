import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

const getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword && req.query.keyword !== 'undefined'
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};
    
  const category = req.query.category && req.query.category !== 'All Items' && req.query.category !== 'undefined'
    ? (req.query.category === 'Fashion' 
        ? { category: { $in: ['Fashion', 'Clothes'] } } 
        : { category: req.query.category })
    : {};

  let products = await Product.find({ ...keyword, ...category });

  // Shuffle products when displaying all items so they appear nicely mixed
  if (!req.query.category || req.query.category === 'All Items' || req.query.category === 'undefined') {
    products = products.sort(() => Math.random() - 0.5);
  }

  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProducts = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (ids && ids.length > 0) {
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Products removed' });
  } else {
    res.status(400);
    throw new Error('No products selected');
  }
});

const createProducts = asyncHandler(async (req, res) => {
  const { products } = req.body;

  if (products && products.length > 0) {
    const productsToCreate = products.map((p) => ({
      ...p,
      user: req.user._id,
      image: p.image || '/images/sample.jpg',
      numReviews: 0,
      description: p.description || 'Sample description',
    }));

    const createdProducts = await Product.insertMany(productsToCreate);
    res.status(201).json(createdProducts);
  } else {
    res.status(400);
    throw new Error('No products provided');
  }
});

export { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  deleteProducts,
  createProducts
};
