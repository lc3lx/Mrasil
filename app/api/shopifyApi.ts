import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface GetShopifyAuthUrlResponse {
  authUrl: string;
}

export const shopifyApi = createApi({
  reducerPath: 'shopifyApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAuthUrl: builder.query<GetShopifyAuthUrlResponse, { storeName?: string; firstName: string; lastName: string }>({
      query: ({ firstName, lastName }) => {
        const storeName = `${firstName}-${lastName}`;
        return {
          url: `/shopify/auth?storeName=${encodeURIComponent(storeName)}`,
          method: 'GET',
          headers: {
            'firstName': firstName,
            'lastName': lastName,
          },
          credentials: 'include',
        };
      },
    }),
  }),
});

export const { useGetAuthUrlQuery, useLazyGetAuthUrlQuery } = shopifyApi; 