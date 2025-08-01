import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface SearchMyCustomerShipmentsRequest {
  email: string;
}

export interface SearchMyCustomerShipmentsResponse {
  // Define the expected response structure here
  // For now, use any
  [key: string]: any;
}

export const searchMyCustomerShipmentsApi = createApi({
  reducerPath: 'searchMyCustomerShipmentsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    searchShipments: builder.query<SearchMyCustomerShipmentsResponse, SearchMyCustomerShipmentsRequest>({
      query: ({ email }) => ({
        url: `/shipment/return/shipments?email=${encodeURIComponent(email)}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useSearchShipmentsQuery } = searchMyCustomerShipmentsApi; 