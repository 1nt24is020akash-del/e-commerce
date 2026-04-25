import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, category } = {}) => {
        let params = {};
        if (keyword) params.keyword = keyword;
        if (category && category !== 'All Items') params.category = category;
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
    seedProducts: builder.mutation({
      query: () => ({ url: '/seed-all-products', method: 'GET' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery, useGetProductDetailsQuery,
  useCreateProductMutation, useUpdateProductMutation,
  useDeleteProductMutation, useSeedProductsMutation,
} = productsApiSlice;
