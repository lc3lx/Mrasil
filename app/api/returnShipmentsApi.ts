import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface ReturnShipmentParams {
  type: string;
  shipmentId?: string;
  typerequest?: string;
  requestNote?: string;
}

export interface Shipment {
  _id: string;
  company: string;
  receiver: any;
}

export interface ReturnShipment {
  _id: string;
  type: string;
  requestNote: string;
  createdAt: string;
  shipment: Shipment;
}

export interface ReturnShipmentsResponse {
  status: string;
  data: ReturnShipment[];
}

export const returnShipmentsApi = createApi({
  reducerPath: 'returnShipmentsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getReturnShipments: builder.query<ReturnShipmentsResponse, ReturnShipmentParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.type) searchParams.append('type', params.type);
        if (params.shipmentId) searchParams.append('shipmentId', params.shipmentId);
        if (params.typerequest) searchParams.append('typerequest', params.typerequest);
        if (params.requestNote) searchParams.append('requestNote', params.requestNote);
        return {
          url: `/shipment/return/my-returns?${searchParams.toString()}`,
          method: 'GET',
          credentials: 'include',
        };
      },
    }),
  }),
});

export const { useGetReturnShipmentsQuery, useLazyGetReturnShipmentsQuery } = returnShipmentsApi; 