import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface HandleReturnApprovalRequest {
  returnRequestId: string;
  approve: boolean | string;
}

export interface HandleReturnApprovalResponse {
  success?: boolean;
  message?: string;
  // Add more fields if the response contains them
}

export const handleReturnApprovalApi = createApi({
  reducerPath: 'handleReturnApprovalApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['ReturnShipments'],
  endpoints: (builder) => ({
    handleApproval: builder.mutation<HandleReturnApprovalResponse, HandleReturnApprovalRequest>({
      query: (body) => ({
        url: '/shipment/return/handle-approval',
        method: 'POST',
        body,
        credentials: 'include',
      }),
      invalidatesTags: ['ReturnShipments'],
    }),
  }),
});

export const { useHandleApprovalMutation } = handleReturnApprovalApi; 