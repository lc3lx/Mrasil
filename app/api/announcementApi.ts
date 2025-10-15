import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from "@/lib/constants";

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  fontSize: 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  isActive?: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateAnnouncementRequest extends Partial<CreateAnnouncementRequest> {
  _id: string;
}

export const announcementApi = createApi({
  reducerPath: 'announcementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/announcements`,
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        const clean = token.replace(/^Bearer\s+/i, "");
        headers.set('authorization', `Bearer ${clean}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Announcement'],
  endpoints: (builder) => ({
    // Get all announcements (admin)
    getAllAnnouncements: builder.query<Announcement[], void>({
      query: () => '/',
      providesTags: ['Announcement'],
    }),

    // Get active announcements (public)
    getActiveAnnouncements: builder.query<Announcement[], void>({
      query: () => '/active',
      providesTags: ['Announcement'],
    }),

    // Get single announcement
    getAnnouncement: builder.query<Announcement, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Announcement', id }],
    }),

    // Create announcement
    createAnnouncement: builder.mutation<Announcement, CreateAnnouncementRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Update announcement
    updateAnnouncement: builder.mutation<Announcement, UpdateAnnouncementRequest>({
      query: ({ _id, ...data }) => ({
        url: `/${_id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Announcement', id: _id },
        'Announcement',
      ],
    }),

    // Delete announcement
    deleteAnnouncement: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Announcement'],
    }),

    // Toggle announcement status
    toggleAnnouncementStatus: builder.mutation<Announcement, string>({
      query: (id) => ({
        url: `/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Announcement', id },
        'Announcement',
      ],
    }),
  }),
});

export const {
  useGetAllAnnouncementsQuery,
  useGetActiveAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useToggleAnnouncementStatusMutation,
} = announcementApi;
