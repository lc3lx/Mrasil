import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// Define interfaces
export interface ChatRequest {
  message: string;
  user_id: string;
  user_token?: string;
  session_id?: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  action: string;
  data: {
    conversation_id: string;
    session_id: string;
    execution_result?: any;
  };
  timestamp: string;
}

export interface ConversationMessage {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: string;
  action?: string;
}

export interface ConversationHistory {
  success: boolean;
  data: {
    conversation_id: string;
    session_id: string;
    messages: ConversationMessage[];
    totalMessages: number;
    lastActivity: string;
  };
}

export interface ConversationStats {
  success: boolean;
  data: {
    totalConversations: number;
    totalMessages: number;
    totalActions: number;
    activeConversations: number;
    lastActivity: string | null;
  };
}

// Create the API slice
export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state or localStorage
      const token =
        (getState() as RootState)?.auth?.token || localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Conversations"],
  endpoints: (builder) => ({
    // Chat with AI
    chatWithAI: builder.mutation<ChatResponse, ChatRequest>({
      query: (chatData) => ({
        url: "/ai/chat",
        method: "POST",
        body: chatData,
      }),
      invalidatesTags: ["Conversations"],
    }),

    // Get conversation history
    getConversationHistory: builder.query<
      ConversationHistory,
      { userId: string; limit?: number; session_id?: string }
    >({
      query: ({ userId, limit = 50, session_id }) => ({
        url: `/ai/conversation/${userId}`,
        params: { limit, session_id },
      }),
      providesTags: (result) =>
        result
          ? [{ type: "Conversations", id: result.data.conversation_id }]
          : ["Conversations"],
    }),

    // Delete conversation
    deleteConversation: builder.mutation<void, string>({
      query: (conversationId) => ({
        url: `/ai/conversation/${conversationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Conversations"],
    }),

    // Get conversation stats
    getConversationStats: builder.query<ConversationStats, string>({
      query: (userId) => `/ai/stats/${userId}`,
      providesTags: ["Conversations"],
    }),
  }),
});

export const {
  useChatWithAIMutation,
  useGetConversationHistoryQuery,
  useDeleteConversationMutation,
  useGetConversationStatsQuery,
} = aiApi;
