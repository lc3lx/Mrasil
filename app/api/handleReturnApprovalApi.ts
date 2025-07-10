import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface HandleReturnApprovalRequest {
  returnRequestId: string;
  approve: string;
}

export interface HandleReturnApprovalResponse {
  success?: boolean;
  message?: string;
  // Add more fields if the response contains them
}

export const handleReturnApprovalApi = createApi({
  reducerPath: 'handleReturnApprovalApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    handleApproval: builder.mutation<HandleReturnApprovalResponse, HandleReturnApprovalRequest>({
      query: (body) => ({
        url: '/shipment/return/handle-approval',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useHandleApprovalMutation } = handleReturnApprovalApi; 