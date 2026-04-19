import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (keyword) => ({ url: '/products', params: keyword ? { keyword } : {} }),
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
  }),
});

export const {
  useGetProductsQuery, useGetProductDetailsQuery,
  useCreateProductMutation, useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
