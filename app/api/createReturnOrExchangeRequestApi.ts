import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface CreateReturnOrExchangeRequest {
  shipmentId: string;
  typerequesst: string;
  requestNote: string;
}

export interface CreateReturnOrExchangeResponse {
  success: boolean;
  message: string;
  
}

export const createReturnOrExchangeRequestApi = createApi({
  reducerPath: 'createReturnOrExchangeRequestApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    createRequest: builder.mutation<CreateReturnOrExchangeResponse, CreateReturnOrExchangeRequest>({
      query: (body) => ({
        url: '/shipment/return/create-request',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useCreateRequestMutation } = createReturnOrExchangeRequestApi; 