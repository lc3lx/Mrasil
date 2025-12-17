import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";

// Define types for all requests and responses
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
    role?: string; // إضافة الـ role للأدمن
  };
}

// Create the auth API slice
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // إضافة Content-Type للطلبات
      headers.set("Content-Type", "application/json");

      // إضافة التوكين إذا كان موجود
      const token = localStorage.getItem("token");
      if (token) {
        const cleanToken = token.replace(/^Bearer\s+/i, "");
        headers.set("Authorization", `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData: SignupRequest) => {
        return {
          url: "/auth/signup",
          method: "POST",
          body: userData,
        };
      },
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials: LoginRequest) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<
      { message: string },
      ForgotPasswordRequest
    >({
      query: (data: ForgotPasswordRequest) => ({
        url: "/auth/forgotpassword",
        method: "POST",
        body: data,
      }),
    }),
    verifyResetCode: builder.mutation<
      { message: string },
      VerifyResetCodeRequest
    >({
      query: (data: VerifyResetCodeRequest) => ({
        url: "/auth/verfiypassword",
        method: "POST",
        body: { resetCode: data.resetCode },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (data: ResetPasswordRequest) => ({
        url: "/auth/resetpassword",
        method: "PUT",
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

// Export default for store configuration
export default authApi;
