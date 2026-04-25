import { apiSlice } from './apiSlice';

export const announcementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncement: builder.query({
      query: () => ({
        url: '/announcements',
      }),
      providesTags: ['Announcement'],
      keepUnusedDataFor: 5,
    }),
    updateAnnouncement: builder.mutation({
      query: (data) => ({
        url: '/announcements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Announcement'],
    }),
  }),
});

export const { useGetAnnouncementQuery, useUpdateAnnouncementMutation } = announcementApiSlice;
