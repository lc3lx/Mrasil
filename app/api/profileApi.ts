import { createApi } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from "@/lib/constants"
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

export type ProfileData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
};

export type ProfileApiResponse = {
  data: ProfileData;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

export type ChangePasswordResponse = {
  type: 'success' | 'field';
  msg: string;
};

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileApiResponse, void>({
      query: () => ({
        url: '/customer/getMe',
        method: 'GET',
        credentials: 'include'
      }),
      transformResponse: (response: ProfileApiResponse) => response,
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (credentials) => ({
        url: '/customer/changeMyPassword',
        method: 'PUT',
        body: credentials,
        credentials: 'include'
      }),
    }),
  }),
})

export const { 
  useGetProfileQuery,
  useChangePasswordMutation
} = profileApi; 