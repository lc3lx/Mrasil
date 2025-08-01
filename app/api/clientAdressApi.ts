import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface ClientAddress {
  _id: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  country: string;
  city: string;
  district: string; 
  customer: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateClientAddressRequest {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  country: string;
  city: string;
  district: string;
  customer: string;
}

export interface UpdateClientAddressRequest {
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  country?: string;
  city?: string;
  district?: string;
  customer?: string;
}

export interface ClientAddressResponse {
  results: number;
  data: ClientAddress[];
}

export const clientAdressApi = createApi({
  reducerPath: 'clientAdressApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['ClientAddress'],
  endpoints: (builder) => ({
    getAllClientAddresses: builder.query<ClientAddressResponse, void>({
      query: () => ({
        url: '/clientaddress',
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['ClientAddress'],
    }),
    createClientAddress: builder.mutation<ClientAddress, CreateClientAddressRequest>({
      query: (data) => ({
        url: '/clientaddress',
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
      invalidatesTags: ['ClientAddress'],
    }),
    deleteClientAddress: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/clientaddress/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
      invalidatesTags: ['ClientAddress'],
    }),
    updateClientAddress: builder.mutation<ClientAddress, { id: string; data: UpdateClientAddressRequest }>({
      query: ({ id, data }) => ({
        url: `/clientaddress/${id}`,
        method: 'PUT',
        credentials: 'include',
        body: data,
      }),
      invalidatesTags: ['ClientAddress'],
    }),
    // You can add more endpoints here if needed
  }),
});

export const { 
  useGetAllClientAddressesQuery,
  useCreateClientAddressMutation,
  useDeleteClientAddressMutation,
  useUpdateClientAddressMutation
} = clientAdressApi; 