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

export interface RechargeWalletRequest {
  amount: number;
  name: string;
  number: string;
  cvc: string;
  month: string;
  year: string;
}

export interface RechargeWalletResponse {
  success: boolean;
  amountInHalalas: number;
  netAmount: string;
  customerId: string;
}

export interface GetPaymentStatusResponse {
  success: boolean;
  status: string;
  amountInHalalas: number;
  netAmount: string;
  customerId: string;
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
    rechargeWallet: builder.mutation<RechargeWalletResponse, RechargeWalletRequest>({
      query: (body) => ({
        url: '/wallet/rechargeWallet',
        method: 'POST',
        body,
        credentials: 'include',
      }),
    }),
    rechargeWalletByBank: builder.mutation<any, { amount: number | string; bankreceipt: File }>({
      query: ({ amount, bankreceipt }) => {
        const formData = new FormData();
        formData.append('amount', amount.toString());
        formData.append('bankreceipt', bankreceipt);
        return {
          url: '/wallet/rechargeWalletbyBank',
          method: 'POST',
          body: formData,
          credentials: 'include',
        };
      },
    }),
    getPaymentStatus: builder.query<GetPaymentStatusResponse, string>({
      query: (id) => ({
        url: `/wallet/paymentstatus/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateTransactionStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/wallet/updatestatus/${id}`,
        method: 'PUT',
        body: { status },
        credentials: 'include',
      }),
    }),
  }),
  tagTypes: ['Wallet'],
})

export const { useGetMyWalletQuery, useRechargeWalletMutation, useGetPaymentStatusQuery, useRechargeWalletByBankMutation, useUpdateTransactionStatusMutation } = walletApi 
