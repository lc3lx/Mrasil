import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export const verifyOtpApi = createApi({
  reducerPath: 'verifyOtpApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: (body) => ({
        url: '/shipment/return/verify-otp',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
  }),
});

export const { useVerifyOtpMutation } = verifyOtpApi; 