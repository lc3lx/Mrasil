import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface VerifyEmailRequest {
  email: string;
}

export interface VerifyEmailResponse {
  status: string;
  message: string;
}

export const verifyEmailApi = createApi({
  reducerPath: 'verifyEmailApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    requestOtp: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
      query: (body) => ({
        url: '/shipment/return/request-otp',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useRequestOtpMutation } = verifyEmailApi; 