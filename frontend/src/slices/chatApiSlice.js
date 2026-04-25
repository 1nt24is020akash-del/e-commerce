import { apiSlice } from './apiSlice';

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (userId) => ({
        url: `/chat/${userId}`,
      }),
      providesTags: ['Message'],
      keepUnusedDataFor: 5,
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/chat',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Message'],
    }),
    getChatUsers: builder.query({
      query: () => ({
        url: '/chat/users',
      }),
      providesTags: ['ChatUser'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation, useGetChatUsersQuery } = chatApiSlice;
