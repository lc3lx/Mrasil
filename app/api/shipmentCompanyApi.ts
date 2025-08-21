import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

// ---------------- Interfaces ----------------
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
  shipmentType: ShippingType[];
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

interface ErrorResponse {
  status: string;
  message: string;
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

// ---------------- shipmentApi ----------------
export const shipmentApi = createApi({
  reducerPath: "shipmentApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["ShipmentOrder"],
  endpoints: (builder) => ({
    createShipmentOrder: builder.mutation<ShipmentOrderResponse, CreateShipmentOrderPayload>({
      query: (payload) => ({
        url: "/shipment/accountingshipmentprice",
        method: "POST",
        body: payload,
        credentials: "include",
      }),
      // invalidatesTags: ["ShipmentOrder"],
    }),
  }),
});

// ---------------- shipmentCompanyApi ----------------
export const shipmentCompanyApi = createApi({
  reducerPath: "shipmentCompanyApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["ShipmentCompany"],
  endpoints: (builder) => ({
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
          shipmentType: company.shipmentType ?? [],
          allowedBoxSizes: company.allowedBoxSizes ?? [],
        }));
      },
      transformErrorResponse: (response: { status: number; data: ErrorResponse }) => {
        if (
          response.data?.message?.includes("Invalid token") ||
          response.data?.status === "fail" ||
          response.data?.message?.includes("recently changed")
        ) {
          return { status: response.status, data: response.data };
        }
        return response;
      },
    }),
    getShipmentCompanyInfo: builder.query<any, void>({
      query: () => ({
        url: "/shipmentcompany/info",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: any) => response.data || response,
    }),
  }),
});

// ---------------- Export hooks ----------------
export const { useCreateShipmentOrderMutation } = shipmentApi;
export const { useGetAllShipmentCompaniesQuery, useGetShipmentCompanyInfoQuery } = shipmentCompanyApi;
