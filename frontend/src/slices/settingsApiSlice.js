import { apiSlice } from './apiSlice';

export const settingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => ({
        url: '/settings',
      }),
      providesTags: ['Settings'],
      keepUnusedDataFor: 5,
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings'],
    }),
    uploadMedia: builder.mutation({
      query: (data) => ({
        url: '/upload/media',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useUploadMediaMutation,
} = settingsApiSlice;
