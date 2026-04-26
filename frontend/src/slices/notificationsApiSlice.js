import { apiSlice } from './apiSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation({
      query: (subscription) => ({
        url: '/notifications/subscribe',
        method: 'POST',
        body: { subscription },
      }),
    }),
    sendNotification: builder.mutation({
      query: (data) => ({
        url: '/notifications/send',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useSubscribeMutation, useSendNotificationMutation } = notificationsApiSlice;
