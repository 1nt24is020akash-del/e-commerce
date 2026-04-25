import { apiSlice } from './apiSlice';

export const supportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitQuery: builder.mutation({
      query: (data) => ({
        url: '/support',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
    getQueries: builder.query({
      query: () => ({
        url: '/support',
      }),
      providesTags: ['Support'],
    }),
    updateQueryStatus: builder.mutation({
      query: (data) => ({
        url: `/support/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const {
  useSubmitQueryMutation,
  useGetQueriesQuery,
  useUpdateQueryStatusMutation,
} = supportApiSlice;
