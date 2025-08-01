import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE_URL } from '@/lib/constants'

export const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token')
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, '')
      headers.set('Authorization', `Bearer ${cleanToken}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  }
})

export const baseQueryWithTokenErrorHandling = async (args: any, api: any, extraOptions: any) => {
  const result = await customBaseQuery(args, api, extraOptions)

  if (result.error) {
    const error = result.error as any
    if (error.status === 'PARSING_ERROR' && error.data?.includes('Invalid token')) {
      // The modal will be shown by the TokenErrorProvider
      window.dispatchEvent(new CustomEvent('token-error', { 
        detail: { message: 'Invalid token, please login again..' }
      }))
    } else if (error.data?.message?.includes('Invalid token')) {
      // The modal will be shown by the TokenErrorProvider
      window.dispatchEvent(new CustomEvent('token-error', { 
        detail: { message: error.data.message }
      }))
    }
  }

  return result
} 