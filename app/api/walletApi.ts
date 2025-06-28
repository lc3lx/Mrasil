import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

export interface Wallet {
  _id: string
  customerId: string
  balance: number
  transactions: any[]
  createdAt: string
  updatedAt: string
  __v: number
}

interface GetMyWalletResponse {
  wallet: Wallet
}

export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getMyWallet: builder.query<GetMyWalletResponse, void>({
      query: () => ({
        url: '/wallet/myWallet',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  tagTypes: ['Wallet'],
})

export const { useGetMyWalletQuery } = walletApi 