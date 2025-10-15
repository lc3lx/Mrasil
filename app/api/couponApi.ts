import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";

export type DiscountType = "percentage" | "fixed" | "wallet_credit";

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableUsers?: string[];
  applicableShippingCompanies?: string[];
  usageLimit?: number;
  perUserLimit?: number;
  totalUsed?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponCreateRequest {
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
  applicableUsers?: string[];
  applicableShippingCompanies?: string[];
  usageLimit?: number;
  perUserLimit?: number;
}

export interface CouponUpdateRequest extends Partial<CouponCreateRequest> {
  _id: string;
}

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/coupons`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const clean = token.replace(/^Bearer\s+/i, "");
        headers.set('authorization', `Bearer ${clean}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Coupon'],
  endpoints: (builder) => ({
    // List
    getCoupons: builder.query<Coupon[], void>({
      query: () => '/',
      transformResponse: (resp: any) => Array.isArray(resp) ? resp : (resp?.data ?? []),
      providesTags: ['Coupon'],
    }),
    // Get by id
    getCoupon: builder.query<Coupon, string>({
      query: (id) => `/${id}`,
      transformResponse: (resp: any) => resp?.data ?? resp,
      providesTags: (result, error, id) => [{ type: 'Coupon', id } as any],
    }),
    // Create
    createCoupon: builder.mutation<Coupon, CouponCreateRequest>({
      query: (data) => ({ url: '/', method: 'POST', body: data }),
      transformResponse: (resp: any) => resp?.data ?? resp,
      invalidatesTags: ['Coupon'],
    }),
    // Update
    updateCoupon: builder.mutation<Coupon, CouponUpdateRequest>({
      query: ({ _id, ...data }) => ({ url: `/${_id}`, method: 'PUT', body: data }),
      transformResponse: (resp: any) => resp?.data ?? resp,
      invalidatesTags: (result, error, { _id }) => [{ type: 'Coupon', id: _id } as any, 'Coupon'],
    }),
    // Delete
    deleteCoupon: builder.mutation<{ message?: string }, string>({
      query: (id) => ({ url: `/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
    // Validate (user)
    validateCoupon: builder.mutation<{ success: boolean; data?: any; message?: string }, { code: string; shippingCompanyIds?: string[] }>({
      query: (body) => ({ url: '/validate', method: 'POST', body }),
    }),
    // Apply (user)
    applyCoupon: builder.mutation<{ success: boolean; data?: any; message?: string }, { code: string; shippingCompanyIds?: string[] }>({
      query: (body) => ({ url: '/apply', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useGetCouponQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useValidateCouponMutation,
  useApplyCouponMutation,
} = couponApi;
