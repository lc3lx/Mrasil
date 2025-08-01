import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface Transaction {
  _id: string;
  type: string;
  description: string;
  amount: number;
  method: string;
  status: string;
  walletId: string;
  createdAt: string;
}

interface GetMyTransactionsResponse {
  message: string;
  result: number;
  data: Transaction[];
}

export const transicationApi = createApi({
  reducerPath: 'transicationApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getMyTransactions: builder.query<GetMyTransactionsResponse, void>({
      query: () => ({
        url: '/tranactions/my-transaction',
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  tagTypes: ['Transaction'],
});

export const { useGetMyTransactionsQuery } = transicationApi; 