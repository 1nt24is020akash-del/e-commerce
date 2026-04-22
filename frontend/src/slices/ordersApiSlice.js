import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({ url: '/orders', method: 'POST', body: {...order} }),
      invalidatesTags: ['Order'],
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({ url: `/orders/${orderId}/pay`, method: 'PUT', body: { ...details } }),
      invalidatesTags: ['Order'],
    }),
    payOrderAdmin: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/payadmin`, method: 'PUT' }),
      invalidatesTags: ['Order'],
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `/orders/mine` }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({ url: `/orders` }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/deliver`, method: 'PUT' }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, usePayOrderAdminMutation,
  useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation,
} = ordersApiSlice;
