import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

// Define interfaces for the response data
export interface Address {
  alias: string;
  location: string;
  city: string;
  phone: string;
  country: string;
  _id: string;
}

interface AddressesResponse {
  message: string;
  result: number;
  data: Address[];
}

interface ErrorResponse {
  status: string;
  message: string;
}

export const adressesApi = createApi({
  reducerPath: "adressesApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["Addresses"],
  endpoints: (builder) => ({
    getAllAddresses: builder.query<AddressesResponse, void>({
      query: () => ({
        url: "/addresses",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => [
        ...(result?.data?.map((address) => ({ type: "Addresses", id: address._id } as const)) || []),
        { type: "Addresses", id: "LIST" },
      ],
      transformErrorResponse: (response: {
        status: number;
        data: ErrorResponse;
      }) => {
        if (
          response.data?.message?.includes("Invalid token") ||
          response.data?.status === "fail" ||
          response.data?.message?.includes("recently changed")
        ) {
          return {
            status: response.status,
            data: response.data,
          };
        }
        return response;
      },
    }),
    deleteAddress: builder.mutation<void, string>({
      query: (id) => ({
        url: `/addresses/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Addresses", id: "LIST" }],
    }),
    updateAddress: builder.mutation<Address, Partial<Address> & { _id: string }>({
      query: ({ _id, ...patch }) => ({
        url: `/addresses/${_id}`,
        method: "PATCH",
        body: patch,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Addresses", id: _id },
        { type: "Addresses", id: "LIST" },
      ],
    }),
    createAddress: builder.mutation<Address, Omit<Address, "_id">>({
      query: (newAddress) => ({
        url: "/addresses",
        method: "POST",
        body: newAddress,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Addresses", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  useCreateAddressMutation,
} = adressesApi; 