import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Mission', 'Satellite', 'CostEstimate', 'SustainabilityReport'],
  endpoints: (builder) => ({
    // Health check endpoint
    getHealth: builder.query<{ success: boolean; message: string }, void>({
      query: () => '/health',
    }),
  }),
})

export const { useGetHealthQuery } = apiSlice