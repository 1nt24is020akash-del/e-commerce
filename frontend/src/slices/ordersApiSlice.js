import { apiSlice } from './apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({ url: '/orders', method: 'POST', body: {...order} }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({ url: `/orders/${orderId}` }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({ url: `/orders/${orderId}/pay`, method: 'PUT', body: { ...details } }),
    }),
    getMyOrders: builder.query({
      query: () => ({ url: `/orders/mine` }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({ url: `/orders` }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/deliver`, method: 'PUT' }),
    }),
  }),
});

export const {
  useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation,
  useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation,
} = ordersApiSlice;
