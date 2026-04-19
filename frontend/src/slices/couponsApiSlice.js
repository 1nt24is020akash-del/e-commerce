import { apiSlice } from './apiSlice';

export const couponsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCouponByCode: builder.query({
      query: (code) => ({
        url: `/coupons/${code}`,
      }),
    }),
  }),
});

export const { useGetCouponByCodeQuery, useLazyGetCouponByCodeQuery } = couponsApiSlice;
