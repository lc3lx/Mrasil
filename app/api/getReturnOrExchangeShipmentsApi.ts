import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface Shipment {
  _id: string;
  company: string;
  receiver: any;
}

export interface ReturnOrExchangeData {
  _id: string;
  type: string;
  requestNote: string;
  createdAt: string;
  shipment: Shipment;
}

export interface GetReturnOrExchangeShipmentsResponse {
  status: string;
  count: number;
  data: ReturnOrExchangeData[];
}

export const getReturnOrExchangeShipmentsApi = createApi({
  reducerPath: 'getReturnOrExchangeShipmentsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getShipments: builder.query<GetReturnOrExchangeShipmentsResponse, { type: string }>({
      query: ({ type }) => ({
        url: `/shipment/return/my-returns?type=${type}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGetShipmentsQuery } = getReturnOrExchangeShipmentsApi; 