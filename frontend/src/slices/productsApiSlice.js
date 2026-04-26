import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, category, sort, brand, color, rating, isNewArrival, discount } = {}) => {
        let params = {};
        if (keyword) params.keyword = keyword;
        if (category && category !== 'All Items') params.category = category;
        if (sort) params.sort = sort;
        if (brand) params.brand = brand;
        if (color) params.color = color;
        if (rating) params.rating = rating;
        if (isNewArrival) params.isNewArrival = isNewArrival;
        if (discount) params.discount = discount;
        return { url: '/products', params };
      },
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({ url: `/products/${productId}` }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({ url: '/products', method: 'POST' }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({ url: `/products/${data.productId}`, method: 'PUT', body: data }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({ url: `/products/${productId}`, method: 'DELETE' }),
    }),
    deleteProducts: builder.mutation({
      query: (ids) => ({ url: '/products/delete-multiple', method: 'POST', body: { ids } }),
      invalidatesTags: ['Product'],
    }),
    createMultipleProducts: builder.mutation({
      query: (products) => ({ url: '/products/bulk-create', method: 'POST', body: { products } }),
      invalidatesTags: ['Product'],
    }),
    seedProducts: builder.mutation({
      query: () => ({ url: '/seed-all-products', method: 'GET' }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: '/upload',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery, useGetProductDetailsQuery,
  useCreateProductMutation, useUpdateProductMutation,
  useDeleteProductMutation, useSeedProductsMutation,
  useDeleteProductsMutation, useCreateMultipleProductsMutation,
  useUploadProductImageMutation,
} = productsApiSlice;
