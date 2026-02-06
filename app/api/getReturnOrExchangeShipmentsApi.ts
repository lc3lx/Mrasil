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
  reqstatus?: 'pending' | 'yes' | 'no';
  shipment: Shipment;
}

export interface GetReturnOrExchangeShipmentsResponse {
  status: string;
  count: number;
  data: ReturnOrExchangeData[];
}

export type GetReturnOrExchangeShipmentsParams = {
  type: string;
  dateFrom?: string;
  dateTo?: string;
};

export const getReturnOrExchangeShipmentsApi = createApi({
  reducerPath: 'getReturnOrExchangeShipmentsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['ReturnShipments'],
  endpoints: (builder) => ({
    getShipments: builder.query<GetReturnOrExchangeShipmentsResponse, GetReturnOrExchangeShipmentsParams>({
      query: ({ type, dateFrom, dateTo }) => {
        const params = new URLSearchParams();
        params.set('type', type);
        if (dateFrom) params.set('dateFrom', dateFrom);
        if (dateTo) params.set('dateTo', dateTo);
        return {
          url: `/shipment/return/my-returns?${params.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
      providesTags: ['ReturnShipments'],
    }),
  }),
});

export const { useGetShipmentsQuery } = getReturnOrExchangeShipmentsApi; 