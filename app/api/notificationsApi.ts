import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@/lib/constants';

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

// Base query hitting backend directly
const notificationsBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '');
      headers.set('Authorization', `Bearer ${cleanToken}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
  credentials: 'include',
});

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: notificationsBaseQuery,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getMyNotifications: builder.query<GetMyNotificationsResponse, void>({
      query: () => ({
        url: 'notifications/getMynotification',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id: string) => ({
        url: `notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    getUnreadNotificationsCount: builder.query<{ unreadCount: number }, void>({
      query: () => ({
        url: 'notifications/unread-count',
        method: 'GET',
      }),
      providesTags: ['Notifications'],
    }),
  }),
});

export const { useGetMyNotificationsQuery, useMarkNotificationAsReadMutation, useGetUnreadNotificationsCountQuery } = notificationsApi; 