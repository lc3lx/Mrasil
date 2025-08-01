import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface OrderForClientAddressRequest {
  number_of_boxes: number;
  box_dimensions: {
    width: number;
    height: number;
    length: number;
  };
  weight: number;
  payment_method: string;
  product_value: number;
}

export interface OrderForClientAddressResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const orderForClientAddressApi = createApi({
  reducerPath: 'orderForClientAddressApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    orderForClientAddress: builder.mutation<OrderForClientAddressResponse, { id: string, order: OrderForClientAddressRequest }>({
      query: ({ id, order }) => ({
        url: `clientaddress/${id}/orders`,
        method: 'POST',
        body: order,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useOrderForClientAddressMutation } = orderForClientAddressApi; 