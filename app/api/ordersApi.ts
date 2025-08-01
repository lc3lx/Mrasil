import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

interface OrderStatus {
  name: string;
}

interface ClientAddress {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  country: string;
  city: string;
  district: string;
}

interface Order {
  _id: string;
  status: OrderStatus;
  payment_method: string;
  platform: string;
  number_of_boxes: number;
  weight: number;
  product_value: number;
  clientAddress: ClientAddress;
  Customer: string;
  items: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrdersResponse {
  results: number;
  data: Order[];
}

interface ErrorResponse {
  status: string;
  message: string;
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: '/orderManually',
        method: 'GET',
        credentials: 'include'
      }),
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        if (response.data?.message?.includes('Invalid token') ||
            response.data?.status === 'fail' ||
            response.data?.message?.includes('recently changed')) {
          return {
            status: response.status,
            data: response.data
          }
        }
        return response
      }
    }),
    deleteOrder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/orderManually/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        if (response.data?.message?.includes('Invalid token') ||
            response.data?.status === 'fail' ||
            response.data?.message?.includes('recently changed')) {
          return {
            status: response.status,
            data: response.data
          }
        }
        return response
      }
    }),
    getOrdersByStatus: builder.query<OrdersResponse, string>({
      query: (status) => ({
        url: `/orderManually/filter/status?status=${status}`,
        method: 'GET',
        credentials: 'include',
      }),
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        if (response.data?.message?.includes('Invalid token') ||
            response.data?.status === 'fail' ||
            response.data?.message?.includes('recently changed')) {
          return {
            status: response.status,
            data: response.data
          }
        }
        return response
      }
    }),
    updateOrderStatus: builder.mutation<void, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orderManually/${id}/status`,
        method: 'PUT',
        credentials: 'include',
        body: { status }
      }),
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        if (response.data?.message?.includes('Invalid token') ||
            response.data?.status === 'fail' ||
            response.data?.message?.includes('recently changed')) {
          return {
            status: response.status,
            data: response.data
          }
        }
        return response
      }
    }),
  }),
  tagTypes: ['Orders']
})

export const { 
  useGetAllOrdersQuery, 
  useDeleteOrderMutation,
  useGetOrdersByStatusQuery,
  useUpdateOrderStatusMutation
} = ordersApi 