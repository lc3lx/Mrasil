import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

export interface Wallet {
  _id: string;
  customerId: string;
  balance: number;
  transactions: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GetMyWalletResponse {
  wallet: Wallet;
}

export interface RechargeWalletRequest {
  amount: number;
}

export interface RechargeWalletResponse {
  success: boolean;
  amountInHalalas: number;
  netAmount: string;
  customerId: string;
}

export interface WalletSummary {
  currentBalance: number;
  totalDeposits: number;
  totalPayments: number;
  depositsByType: {
    wallet_recharge: number;
    shipment_cancel_refund: number;
    return_shipment_refund: number;
    coupon_credit: number;
    admin_credit: number;
    manual_addition: number;
  };
  paymentsByType: {
    shipment_payment: number;
    return_shipment: number;
    package_purchase: number;
    admin_debit: number;
    manual_removal: number;
  };
  totalTransactions: number;
  recentTransactions: any[];
}

interface GetWalletSummaryResponse {
  success: boolean;
  data: WalletSummary;
}

export interface GetPaymentStatusResponse {
  success: boolean;
  status: string;
  amountInHalalas: number;
  netAmount: string;
  customerId: string;
}

// @ts-ignore - RTK Query type issues
export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["Wallet"],
  endpoints: (builder) => ({
    getMyWallet: builder.query({
      query: () => ({
        url: "/wallet/myWallet",
        method: "GET",
        credentials: "include",
      }),
    }),
    getWalletSummary: builder.query({
      query: () => ({
        url: "/wallet/summary",
        method: "GET",
        credentials: "include",
      }),
    }),
    rechargeWallet: builder.mutation({
      query: (body) => ({
        url: "/wallet/rechargeWallet",
        method: "POST",
        body,
        credentials: "include",
      }),
    }),
    rechargeWalletByBank: builder.mutation({
      query: (formData) => ({
        url: "/wallet/rechargeWalletbyBank",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
    }),
    getPaymentStatus: builder.query({
      query: (id) => ({
        url: `/wallet/paymentstatus/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateTransactionStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/wallet/updatestatus/${id}`,
        method: "PUT",
        body: { status },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetMyWalletQuery,
  useGetWalletSummaryQuery,
  useRechargeWalletMutation,
  useGetPaymentStatusQuery,
  useRechargeWalletByBankMutation,
  useUpdateTransactionStatusMutation,
} = walletApi;
