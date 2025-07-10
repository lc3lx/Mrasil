import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

// Notification type based on the API response in the image
export interface Notification {
  _id: string;
  userId: string | null;
  type: string;
  message: string;
  readStatus: boolean;
  timestamp: string;
  __v: number;
}

export interface GetMyNotificationsResponse {
  status?: string;
  data: Notification[];
}

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getMyNotifications: builder.query<GetMyNotificationsResponse, void>({
      query: () => ({
        url: 'notifications/getMynotification',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `notifications/${id}/read`,
        method: 'PUT',
        credentials: 'include',
      }),
      invalidatesTags: ['Notifications'],
    }),
    getUnreadNotificationsCount: builder.query<{ unreadCount: number }, void>({
      query: () => ({
        url: 'notifications/unread-count',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Notifications'],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkNotificationAsReadMutation, useGetUnreadNotificationsCountQuery } = notificationsApi; 