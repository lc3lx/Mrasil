import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface ZidAuthUrlResponse {
  authUrl: string;
}

export const zedApi = createApi({
  reducerPath: 'zedApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getZidAuthUrl: builder.query<ZidAuthUrlResponse, void>({
      query: () => ({
        url: '/zid/auth/url',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGetZidAuthUrlQuery } = zedApi; 