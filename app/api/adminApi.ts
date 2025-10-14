import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "@/lib/constants";

// Admin Dashboard Stats Interface
export interface AdminStats {
  totalUsers: number;
  totalShipments: number;
  totalRevenue: number;
  pendingShipments: number;
  completedShipments: number;
  cancelledShipments: number;
}

// Recent Activity Interface
export interface RecentActivity {
  id: string;
  type: 'shipment_delivered' | 'new_user' | 'shipment_delayed' | 'payment_received';
  message: string;
  timestamp: string;
  userId?: string;
  shipmentId?: string;
}

// User Management Interface
export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

// Shipment Management Interface
export interface AdminShipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  status: string;
  company: string;
  createdAt: string;
  deliveredAt?: string;
  amount: number;
}

// Create the admin API slice
export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      const token = localStorage.getItem("token");
      if (token) {
        const cleanToken = token.replace(/^Bearer\s+/i, "");
        headers.set("Authorization", `Bearer ${cleanToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AdminStats', 'Users', 'Shipments', 'Activity', 'Orders', 'Wallets'],
  endpoints: (builder) => ({
    // Get Dashboard Stats
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getCarrierStats: builder.query<{ data: any }, { startDate?: string; endDate?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        const startDate = (args as any)?.startDate;
        const endDate = (args as any)?.endDate;
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const qs = params.toString();
        return `/admin/carriers/stats${qs ? `?${qs}` : ''}`;
      },
    }),
    
    // Get Recent Activity
    getRecentActivity: builder.query({
      query: ({ limit = 10 }) => `/admin/activity?limit=${limit}`,
      providesTags: ['Activity'],
    }),
    
    // User Management
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = '', role = '' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (role) params.append('role', role);
        return `/admin/users?${params.toString()}`;
      },
      providesTags: ['Users'],
    }),
    
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),
    
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/admin/users/${userId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),

    // Delete User
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `/admin/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'AdminStats'],
    }),

    // Get User Wallet
    getUserWallet: builder.query({
      query: ({ userId }) => `/admin/users/${userId}/wallet`,
      providesTags: ['Wallets'],
    }),

    // Get User Activity
    getUserActivity: builder.query({
      query: ({ userId }) => `/admin/users/${userId}/activity`,
      providesTags: ['Activity'],
    }),

    // Add Balance to User
    addBalanceToUser: builder.mutation({
      query: ({ userId, amount, reason }) => ({
        url: `/admin/wallets/${userId}/add-balance`,
        method: 'POST',
        body: { amount, reason },
      }),
      invalidatesTags: ['Wallets', 'AdminStats'],
    }),

    // Get Pending Bank Transfers
    getPendingBankTransfers: builder.query({
      query: () => '/admin/wallets/pending-transfers',
      providesTags: ['Wallets'],
    }),

    // Approve Bank Transfer
    approveBankTransfer: builder.mutation({
      query: ({ transactionId, approved, notes }) => ({
        url: `/admin/wallets/approve-bank-transfer/${transactionId}`,
        method: 'PUT',
        body: { approved, notes },
      }),
      invalidatesTags: ['Wallets', 'AdminStats'],
    }),
    
    // Shipment Management
    getAllShipments: builder.query({
      query: ({ page = 1, limit = 10, status = '', search = '', userId = '' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (userId) params.append('userId', userId);
        return `/admin/shipments?${params.toString()}`;
      },
      providesTags: ['Shipments'],
    }),

    // Orders Management
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10, status = '', search = '', userId = '' }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        if (userId) params.append('userId', userId);
        return `/admin/orders?${params.toString()}`;
      },
      providesTags: ['Orders'],
    }),
    
    updateShipmentStatus: builder.mutation({
      query: ({ shipmentId, status, notes = '' }) => ({
        url: `/admin/shipments/${shipmentId}/status`,
        method: 'PATCH',
        body: { status, notes },
      }),
      invalidatesTags: ['Shipments', 'AdminStats'],
    }),
    
    // System Settings
    getSystemSettings: builder.query({
      query: () => '/admin/settings',
    }),
    
    updateSystemSettings: builder.mutation({
      query: (settings) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: settings,
      }),
    }),
    
    // Reports
    getRevenueReport: builder.query({
      query: ({ startDate, endDate, groupBy = 'day' }) => 
        `/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
    }),
    
    getShipmentReport: builder.query({
      query: ({ startDate, endDate, groupBy = 'day' }) => 
        `/admin/reports/shipments?startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
    }),
  }),
});

// Export the generated hooks
export const {
  useGetAdminStatsQuery,
  useGetCarrierStatsQuery,
  useGetRecentActivityQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetUserWalletQuery,
  useGetUserActivityQuery,
  useAddBalanceToUserMutation,
  useGetPendingBankTransfersQuery,
  useApproveBankTransferMutation,
  useGetAllShipmentsQuery,
  useGetAllOrdersQuery,
  useUpdateShipmentStatusMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetRevenueReportQuery,
  useGetShipmentReportQuery,
} = adminApi;
