import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

export interface Dimension {
  high: number;
  width: number;
  length: number;
}

export interface SenderAddress {
  full_name: string;
  mobile: string;
  city: string;
  country: string;
  address: string;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: number;
  country: string;
}

export interface Shipment {
  _id: string;
  dimension: Dimension;
  customerId: Customer;
  orderId: string;
  senderAddress: SenderAddress;
  boxNum: number;
  weight: number;
  orderDescription: string;
  shapmentingType: string;
  shapmentCompany: string;
  shapmentType: string;
  orderSou: string;
  totalprice: number;
  createdAt: string;
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface GetMyShipmentsResponse {
  status: string
  results: number
  pagination: Pagination
  data: Shipment[]
}

export interface CreateShipmentOrderPayload {
  company: string;
  shapmentingType: string;
  order: {
    weight: number;
    total: {
      amount: number;
      currency: string;
    };
    paymentMethod: string;
    description: string;
    source: string;
    direction: string;
    customer: {
      full_name: string;
      mobile: string;
      city: string;
      country: string;
      address: string;
      email: string;
      district: string;
    };
  };
}

export interface ShipmentOrderResponse {
  success: boolean;
  data: any; 
  message?: string;
}

// واجهات جديدة لشركات الشحن
interface AllowedBoxSize {
  length: number;
  width: number;
  height: number;
  _id: string;
}

interface ShippingType {
  type: string;
  code: string;
  RTOcode: string;
  COD: boolean;
  maxCodAmount: number;
  maxWeight: number;
  maxBoxes: number;
  priceaddedtax: number;
  basePrice: number;
  profitPrice: number;
  baseRTOprice: number;
  profitRTOprice: number;
  baseAdditionalweigth: number;
  profitAdditionalweigth: number;
  baseCODfees: number;
  profitCODfees: number;
  insurancecost: number;
  basepickUpPrice: number;
  profitpickUpPrice: number;
  _id: string;
  deliveryTime?: string;
}

export interface ShipmentCompany {
  _id: string;
  company: string;
  shippingTypes: ShippingType[];
  minShipments: number;
  status: "Enabled" | "Disabled";
  conditions: string;
  details: string;
  conditionsAr: string;
  detailsAr: string;
  trackingURL: string;
  pickUpStatus: "Yes" | "No";
  allowedBoxSizes: AllowedBoxSize[];
  deliveryTime?: string;
}

export const shipmentApi = createApi({
  reducerPath: 'shipmentApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ['Shipment', 'ShipmentCompany'],
  endpoints: (builder) => ({
    getMyShipments: builder.query<GetMyShipmentsResponse, { page?: number; itemsPerPage?: number }>({
      query: ({ page = 1, itemsPerPage = 5 } = {}) => ({
        url: `/shipment/my-shipments?page=${page}&itemsPerPage=${itemsPerPage}`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Shipment'],
    }),

    createShipmentOrder: builder.mutation<ShipmentOrderResponse, CreateShipmentOrderPayload>({
      query: (payload) => ({
        url: "/shipment/accountingshipmentprice",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      invalidatesTags: ['Shipment'],
    }),

    createShipment: builder.mutation<any, any>({
      query: (shipmentData) => ({
        url: '/shipment/createshipment',
        method: 'POST',
        body: shipmentData,
        credentials: 'include',
      }),
      invalidatesTags: ['Shipment'],
    }),

    cancelShipment: builder.mutation<{ status: string; message: string }, string>({
      query: (shipmentId) => ({
        url: `/shipment/cancel/${shipmentId}`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['Shipment'],
    }),

    // إضافة endpoint لشركات الشحن
    getAllShipmentCompanies: builder.query<ShipmentCompany[], void>({
      query: () => ({
        url: "/shipmentcompany",
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result = []) => [
        ...result.map((company) => ({ type: "ShipmentCompany", id: company._id } as const)),
        { type: "ShipmentCompany", id: "LIST" },
      ],
      transformResponse: (response: any) => {
        const companies = Array.isArray(response) ? response : response?.data ?? [];
        return companies.map((company: any) => ({
          ...company,
          shippingTypes: company.shipmentType ?? [],
          allowedBoxSizes: company.allowedBoxSizes ?? [],
        }));
      },
    }),

    // إضافة endpoint لمعلومات شركة الشحن
    getShipmentCompanyInfo: builder.query<any, void>({
      query: () => ({
        url: "/shipmentcompany/info",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: any) => response.data || response,
    }),
  }),
})

export const { 
  useGetMyShipmentsQuery, 
  useCreateShipmentMutation, 
  useCancelShipmentMutation,
  useCreateShipmentOrderMutation,
  useGetAllShipmentCompaniesQuery,
  useGetShipmentCompanyInfoQuery
} = shipmentApi