import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

export interface CustomerAddress {
  _id: string;
  alias: string;
  location: string;
  city: string;
  phone: string;
  country?: string;
  email?: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  active: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  passwordResetCode?: string;
  passwordResetExpires?: string;
  passwordResetVerified?: boolean;
  passwordChangedAt?: string;
  addresses: CustomerAddress[];
  additional_info?: string;
  brand_color?: string;
  brand_email?: string;
  brand_logo?: string;
  brand_website?: string;
  commercial_registration_number?: string;
  company_name_ar?: string;
  company_name_en?: string;
  tax_number?: string;
  profileImage?: string;
}

export interface CustomerResponse {
  data: Customer;
}

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["Customer"],
  endpoints: (builder) => ({
    getCustomerById: builder.query<CustomerResponse, string>({
      query: (id) => ({
        url: `/customer/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Customer"],
    }),
    getCustomerMe: builder.query<CustomerResponse, void>({
      query: () => ({
        url: "/customer/getMe",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Customer"],
    }),
    updateCustomerMe: builder.mutation<
      CustomerResponse,
      FormData | Record<string, any>
    >({
      query: (body) => {
        // إذا body من نوع FormData → multipart
        // لا نضيف Content-Type يدوياً، سيتم إضافته تلقائياً مع boundary
        if (body instanceof FormData) {
          console.log("🔧 Sending FormData to backend");
          console.log("🔧 FormData entries:");
          for (const [key, value] of body.entries()) {
            console.log(`  ${key}:`, value);
          }
          return {
            url: "/customer/updateMe",
            method: "PUT",
            body,
            credentials: "include",
            // لا نضيف headers هنا، سيتم إضافة Content-Type تلقائياً
          };
        }

        // إذا body object عادي → JSON
        return {
          url: "/customer/updateMe",
          method: "PUT",
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useGetCustomerByIdQuery,
  useGetCustomerMeQuery,
  useUpdateCustomerMeMutation,
} = customerApi;
