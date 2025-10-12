import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";

export const customBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { endpoint, type, getState }) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanToken = token.replace(/^Bearer\s+/i, "");
      headers.set("Authorization", `Bearer ${cleanToken}`);
    }

    // لا تضيف Content-Type إذا كان موجوداً بالفعل
    // أو إذا كان الـ body من نوع FormData (سيتم تعيينه تلقائياً من المتصفح)
    // نتحقق من عدم وجود Content-Type لأن FormData يحتاج boundary تلقائي
    if (!headers.has("Content-Type")) {
      // لا نضيف Content-Type هنا، سيتم إضافته في الـ query إذا لزم الأمر
    }

    return headers;
  },
});

export const baseQueryWithTokenErrorHandling = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  const result = await customBaseQuery(args, api, extraOptions);

  if (result.error) {
    const error = result.error as any;

    // معالجة أخطاء JSON parsing
    if (error.status === "PARSING_ERROR") {
      console.error("❌ JSON Parsing Error:", error);
      console.error("❌ Response data:", error.data);

      // إذا كان الخطأ بسبب HTML response
      if (typeof error.data === "string" && error.data.includes("<html")) {
        return {
          ...result,
          error: {
            ...error,
            data: {
              message: "خطأ في الخادم - استجابة غير صالحة",
              status: 500,
            },
          },
        };
      }

      // إذا كان الخطأ بسبب استجابة فارغة أو غير صالحة
      if (!error.data || error.data === "") {
        return {
          ...result,
          error: {
            ...error,
            data: {
              message: "لا توجد استجابة من الخادم",
              status: 500,
            },
          },
        };
      }
    }

    if (
      error.status === "PARSING_ERROR" &&
      error.data?.includes("Invalid token")
    ) {
      // The modal will be shown by the TokenErrorProvider
      window.dispatchEvent(
        new CustomEvent("token-error", {
          detail: { message: "Invalid token, please login again.." },
        })
      );
    } else if (error.data?.message?.includes("Invalid token")) {
      // The modal will be shown by the TokenErrorProvider
      window.dispatchEvent(
        new CustomEvent("token-error", {
          detail: { message: error.data.message },
        })
      );
    }
  }

  return result;
};
