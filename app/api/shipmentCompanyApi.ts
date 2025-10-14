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
      providesTags: ["ShipmentCompany"],
      transformResponse: (response: any) => {
        const companies = Array.isArray(response) ? response : response?.data ?? [];
        return companies.map((company: any) => ({
          ...company,
          shipmentType: company.shipmentType ?? company.shippingTypes ?? [],
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
    createShipmentCompany: builder.mutation<ShipmentCompany, Partial<ShipmentCompany>>({
      query: (data) => ({
        url: "/shipmentcompany",
        method: "POST",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["ShipmentCompany"],
    }),
    updateShipmentCompany: builder.mutation<ShipmentCompany, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/shipmentcompany/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["ShipmentCompany"],
    }),
    deleteShipmentCompany: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/shipmentcompany/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["ShipmentCompany"],
    }),
  }),
});

// ---------------- Export hooks ----------------
export const { 
  useGetAllShipmentCompaniesQuery, 
  useGetShipmentCompanyInfoQuery,
  useCreateShipmentCompanyMutation,
  useUpdateShipmentCompanyMutation,
  useDeleteShipmentCompanyMutation,
} = shipmentCompanyApi;
