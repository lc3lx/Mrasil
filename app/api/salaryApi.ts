import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface SalaryModification {
  _id: string;
  employee: {
    _id: string;
  };
  type: string;
  amount: number;
  totalSalary: number;
  reason: string;
  admin: string;
  month: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryModificationsResponse {
  results: number;
  paginationResult: {
    currentPage: number;
    limit: number;
    numberOfPages: number;
  };
  data: SalaryModification[];
}

export interface AddBonusRequest {
  amount: number;
  reason: string;
}

export interface AddBonusResponse {
  status: string;
  message: string;
  data?: any;
}

export interface SalaryByMonth {
  _id: string;
  employeeId: {
    fullName: string;
  };
  salaryDate: string;
  baseSalary: number;
  totalSalary: number;
  bonus: number;
  deduction: number;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SalariesByMonthResponse {
  status: string;
  results: number;
  data: {
    salaries: SalaryByMonth[];
  };
}

export const salaryApi = createApi({
  reducerPath: 'salaryApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAllSalaryModifications: builder.query<SalaryModificationsResponse, void>({
      query: () => ({
        url: '/salarymodifaction',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getSalariesByMonth: builder.query<SalariesByMonthResponse, { month: number; year: number }>({
      query: ({ month, year }) => ({
        url: `/salaries?month=${month}&year=${year}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    addBonus: builder.mutation<AddBonusResponse, { id: string; amount: number; reason: string }>({
      query: ({ id, amount, reason }) => ({
        url: `/salarymodifaction/${id}/bonus`,
        method: 'POST',
        body: { amount, reason },
        headers: { 'x-employee-id': id },
        credentials: 'include',
      }),
    }),
    addDeduction: builder.mutation<AddBonusResponse, { id: string; amount: number; reason: string }>({
      query: ({ id, amount, reason }) => ({
        url: `/salarymodifaction/${id}/deduction`,
        method: 'POST',
        body: { amount, reason },
        headers: { 'x-employee-id': id },
        credentials: 'include',
      }),
    }),
    updateSalaryStatusToPaid: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/salaries/${id}`,
        method: 'PUT',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGetAllSalaryModificationsQuery, useAddBonusMutation, useAddDeductionMutation, useGetSalariesByMonthQuery, useUpdateSalaryStatusToPaidMutation } = salaryApi; 