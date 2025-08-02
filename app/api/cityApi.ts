import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithTokenErrorHandling } from "./customBaseQuery";

export interface City {
  _id: string;
  name: string;
  // أضف أي خصائص أخرى حسب استجابة الـ API
}

interface CitiesResponse {
  message: string;
  result: number;
  data: City[];
}

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: baseQueryWithTokenErrorHandling,
  tagTypes: ["Cities"],
  endpoints: (builder) => ({
    searchCities: builder.query<CitiesResponse, string>({
      query: (name) => ({
        url: `/cities/search?name=${encodeURIComponent(name)}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) => [
        ...(result?.data?.map((city) => ({ type: "Cities", id: city._id } as const)) || []),
        { type: "Cities", id: "LIST" },
      ],
    }),
  }),
});

export const { useSearchCitiesQuery } = cityApi;
