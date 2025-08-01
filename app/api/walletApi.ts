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
  payment: {
    id: string;
    status: string;
    amount: number;
    fee: number;
    currency: string;
    refunded: number;
    refunded_at: string | null;
    captured: number;
    captured_at: string | null;
    voided_at: string | null;
    description: string;
    amount_format: string;
    fee_format: string;
    refunded_format: string;
    captured_format: string;
    invoice_id: string | null;
    ip: string;
    callback_url: string;
    created_at: string;
    updated_at: string;
    metadata: {
      customerId: string;
    };
    source: {
      type: string;
      company: string;
      name: string;
      number: string;
      gateway_id: string;
      reference_number: string | null;
      token: string | null;
      message: string | null;
      transaction_url: string;
      response_code: string | null;
      authorization_code: string | null;
      issuer_name: string;
      issuer_country: string;
      issuer_card_type: string;
      issuer_card_category: string;
    };
  };
}

export interface GetPaymentStatusResponse {
  success: boolean;
  status: string;
  payment: RechargeWalletResponse['payment'];
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