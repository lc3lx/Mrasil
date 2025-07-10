import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

export interface Dimension {
  high: number;
  width: number;
  length: number;
}

export interface SenderAddress {
  full_name: string;
  mobile: string;
  city: string;
  country: string;
  address: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Shipment {
  _id: string;
  dimension: Dimension;
  customerId: Customer;
  orderId: string;
  senderAddress: SenderAddress;
  boxNum: number;
  weight: number;
  orderDescription: string;
  shapmentingType: string;
  shapmentCompany: string;
  shapmentType: string;
  shapmentPrice: number;
  orderSou: string;
  priceaddedtax: number;
  byocPrice: number;
  basepickUpPrice: number;
  profitpickUpPrice: number;
  baseRTOprice: number;
  createdAt: string;
  // Add any other fields as needed
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface GetMyShipmentsResponse {
  status: string
  results: number
  pagination: Pagination
  data: Shipment[]
}

export const shipmentApi = createApi({
  reducerPath: 'shipmentApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getMyShipments: builder.query<GetMyShipmentsResponse, { page?: number; itemsPerPage?: number }>({
      query: ({ page = 1, itemsPerPage = 5 } = {}) => ({
        url: `/shipment/my-shipments?page=${page}&itemsPerPage=${itemsPerPage}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    createShipment: builder.mutation<any, any>({
      query: (shipmentData) => ({
        url: '/shipment/createshipment',
        method: 'POST',
        body: shipmentData,
        credentials: 'include',
      }),
    }),
    cancelShipment: builder.mutation<{ status: string; message: string }, string>({
      query: (shipmentId) => ({
        url: `/shipment/cancel/${shipmentId}`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
  }),
  tagTypes: ['Shipment'],
})

export const { useGetMyShipmentsQuery, useCreateShipmentMutation, useCancelShipmentMutation } = shipmentApi 