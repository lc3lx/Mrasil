import { createApi } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from "@/lib/constants"
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

export type ParcelDimensions = {
  length: number;
  width: number;
  height: number;
};

export type ParcelData = {
  _id: string;
  title: string;
  dimensions: ParcelDimensions;
  maxWeight: number;
  price: number;
  description: string;
  examples: string[];
  isPublic: boolean;
  createdAt: string;
};

export type ParcelApiResponse = {
  status: string;
  results: number;
  data: ParcelData[];
};

export type CreateParcelRequest = {
  title: string;
  dimensions: {
    width: number;
    height: number;
    length: number;
  };
  maxWeight?: number;
  price?: number;
  description?: string;
  isPublic?: boolean;
};

export const parcelsApi = createApi({
  reducerPath: 'parcelsApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAllParcels: builder.query<ParcelApiResponse, void>({
      query: () => ({
        url: '/package',
        method: 'GET',
        credentials: 'include'
      }),
      transformResponse: (response: ParcelApiResponse) => response,
      transformErrorResponse: (error) => error,
      providesTags: ['Parcels']
    }),
    createParcel: builder.mutation<ParcelData, CreateParcelRequest>({
      query: (parcel) => ({
        url: '/package',
        method: 'POST',
        body: parcel,
        credentials: 'include'
      }),
      invalidatesTags: ['Parcels']
    }),
    updateParcel: builder.mutation<ParcelData, { id: string; data: Partial<ParcelData> }>({
      query: ({ id, data }) => ({
        url: `/package/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['Parcels']
    }),
    deleteParcel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/package/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Parcels']
    }),
  }),
  tagTypes: ['Parcels']
});

export const { 
  useGetAllParcelsQuery,
  useCreateParcelMutation,
  useUpdateParcelMutation,
  useDeleteParcelMutation
} = parcelsApi; 