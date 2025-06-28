import { createApi } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from "@/lib/constants"
import { baseQueryWithTokenErrorHandling } from './customBaseQuery'

// Interface for the table view (list of members)
export interface TeamMemberListItem {
  _id: string
  name: string
  fullName: string
  email: string
  idNumber: string
  address: string
  isActive: boolean
}

// Interface for the detailed view
export interface TeamMemberDetails {
  _id: string
  fullName: string
  idNumber: string
  birthDate: string
  gender: string
  nationality: string
  address: string
  email: string
  phoneNumber: string
  hireDate: string
  directManager: string
  salary: number
  housingAllowance: number
  transportationAllowance: number
  otherAllowances: number
  educationCertificates: string[]
  experienceCertificates: string[]
  otherDocuments: string[]
  salaryStatus: string
  isActive: boolean
}

// Interface for creating a new employee
export interface CreateEmployeeRequest {
  fullName?: string
  idNumber?: string
  birthDate?: string
  gender?: string
  nationality?: string
  address?: string
  email?: string
  phoneNumber?: string
  hireDate?: string
  directManager?: string
  salary?: number
  housingAllowance?: number
  transportationAllowance?: number
  otherAllowances?: number
  educationCertificates?: string[]
  experienceCertificates?: string[]
  otherDocuments?: string[]
  salaryStatus?: string
  job?: string
  personalPhoto?: File | null
}

// API Response interfaces
interface TeamListResponse {
  status: string
  data: {
    employees: TeamMemberListItem[]
  }
}

interface TeamMemberDetailsResponse {
  status: string
  data: TeamMemberDetails
}

export const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: baseQueryWithTokenErrorHandling,
  endpoints: (builder) => ({
    getAllTeamMembers: builder.query<TeamListResponse, void>({
      query: () => ({
        url: '/employees',
        method: 'GET',
        credentials: 'include'
      }),
    }),
    getTeamMemberDetails: builder.query<TeamMemberDetailsResponse, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'GET',
        credentials: 'include'
      }),
    }),
    createTeamMember: builder.mutation<TeamMemberDetailsResponse, CreateEmployeeRequest>({
      query: (data) => {
        const formData = new FormData();
        
        // Add all non-file fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'personalPhoto' && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value !== 'object') {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: '/employees',
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, it will be set automatically for FormData
          formData: true,
        }
      },
      invalidatesTags: ['Team']
    }),
    updateTeamMember: builder.mutation<TeamMemberListItem, { id: string; data: Partial<TeamMemberDetails> }>({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      }),
      invalidatesTags: ['Team']
    }),
    deleteTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
        credentials: 'include'
      }),
      invalidatesTags: ['Team']
    }),
  }),
  tagTypes: ['Team']
})

export const { 
  useGetAllTeamMembersQuery,
  useGetTeamMemberDetailsQuery,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation
} = teamApi 