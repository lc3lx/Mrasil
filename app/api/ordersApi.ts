import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

interface Order {
  _id: string
  clientName: string
  clientAddress: string
  clientPhone: string
  clientEmail: string
  country: string
  city: string
  district: string
  createdAt: string
  status?: string
}

interface OrdersResponse {
  status: string
  data: Order[]
}

interface ErrorResponse {
  status: string
  message: string
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAllOrders: builder.query<OrdersResponse, void>({
      query: () => ({
        url: '/clientaddress',
        method: 'GET',
        credentials: 'include'
      }),
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        // This will properly format the error for our error handling
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
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: '/clientaddress',
        method: 'POST',
        body: order,
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
  }),
  tagTypes: ['Orders']
})

export const { 
  useGetAllOrdersQuery, 
  useCreateOrderMutation,
  useDeleteOrderMutation
} = ordersApi 