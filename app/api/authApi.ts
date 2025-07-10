import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

// Define types for all requests and responses
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  resetCode: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

// Create the auth API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgotpassword',
        method: 'POST',
        body: data,
      }),
    }),
    verifyResetCode: builder.mutation<{ message: string }, VerifyResetCodeRequest>({
      query: (data) => ({
        url: '/auth/verfiypassword',
        method: 'POST',
        body: { resetCode: data.resetCode },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/resetpassword',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

// Export the generated hooks
export const {
  useSignupMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
} = authApi; 