import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

interface TrackingResponse {
  status: string;
  message: string;
  data?: any; // هون بتحط شكل الداتا حسب الـ backend
}

export const trackingApi = createApi({
  reducerPath: "trackingApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["Tracking"],
  endpoints: (builder) => ({
    trackShipment: builder.mutation<TrackingResponse, { trackingNumber: string }>({
      query: ({ trackingNumber }) => ({
        url: `/tracking`,
        method: "POST",
        body: { trackingNumber },
        credentials: "include",
      }),
      invalidatesTags: ["Tracking"],
      transformResponse: (response: any) => response.data || response,
    }),
  }),
});

export const { useTrackShipmentMutation } = trackingApi;
