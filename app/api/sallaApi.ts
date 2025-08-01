import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

// Types
export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface SallaAuthUrlResponse extends BaseResponse {
  authUrl: string;
  state: string;
}

export interface WebhookResponse extends BaseResponse {
  webhookUrl: string;
  isEnabled: boolean;
}

export interface UpdateWebhookRequest {
  webhookUrl: string;
  isEnabled: boolean;
}

// API Slice
export const sallaApi = createApi({
  reducerPath: 'sallaApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['Salla', 'SallaWebhook'],
  endpoints: (builder) => ({
    // Auth endpoints
    getSallaAuthUrl: builder.query<SallaAuthUrlResponse, void>({
      query: () => ({
        url: '/salla/auth/url',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Salla'],
    }),

    // Webhook endpoints
    getWebhookStatus: builder.query<WebhookResponse, void>({
      query: () => ({
        url: '/salla/webhook/status',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['SallaWebhook'],
    }),
    updateWebhook: builder.mutation<WebhookResponse, UpdateWebhookRequest>({
      query: (data) => ({
        url: '/salla/webhook/update',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      invalidatesTags: ['SallaWebhook'],
    }),
  }),
});

// Exports
export const { 
  useGetSallaAuthUrlQuery,
  useGetWebhookStatusQuery,
  useUpdateWebhookMutation,
} = sallaApi; 