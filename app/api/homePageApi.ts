import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithTokenErrorHandling } from './customBaseQuery';

export interface HomePageStatistics {
  totalShipments: number;
  todaysShipments: number;
  receivedShipments: number;
  canceledShipments: number;
  growthRate: number;
}

export interface HomePageStatisticsResponse {
  success: boolean;
  data: HomePageStatistics;
}

export interface ShipmentStats {
  totalShipments: number;
  totalValue: number;
  totalShippingCost: number;
  pendingShipments: number;
  deliveredShipments: number;
  inTransitShipments: number;
  shipperBreakdown: {
    _id: string | null;
    count: number;
  }[];
}

export interface ShipmentStatsResponse {
  status: string;
  data: ShipmentStats;
}

export const homePageApi = createApi({
  reducerPath: 'homePageApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getHomePageStatistics: builder.query<HomePageStatistics, void>({
      query: () => ({
        url: '/shipment/statistics',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: any) => response.data || {},
    }),
    getShipmentStats: builder.query<ShipmentStats, void>({
      query: () => ({
        url: '/shipment/stats',
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (response: any) => response.data || {},
    }),
  }),
});

export const { useGetHomePageStatisticsQuery, useGetShipmentStatsQuery } = homePageApi; 