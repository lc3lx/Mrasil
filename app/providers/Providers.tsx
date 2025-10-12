"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import { AuthProvider } from "./AuthProvider";
import { TokenErrorProvider } from "./TokenErrorProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { useEffect } from "react";
import { useTokenError } from "./TokenErrorProvider";
import { Toaster } from "@/components/ui/sonner";

function TokenErrorListener() {
  const { showTokenError } = useTokenError();

  useEffect(() => {
    const handleTokenError = (event: CustomEvent<{ message: string }>) => {
      showTokenError(event.detail.message);
    };

    window.addEventListener("token-error", handleTokenError as EventListener);
    return () => {
      window.removeEventListener(
        "token-error",
        handleTokenError as EventListener
      );
    };
  }, [showTokenError]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TokenErrorProvider>
        <AuthProvider>
          <ToastProvider>
            <TokenErrorListener />
            {children}
          </ToastProvider>
          <Toaster
            position="top-center"
            richColors
            closeButton
            expand
            duration={5000}
            offset="20px"
            toastOptions={{
              style: {
                background: "#fff",
                border: "2px solid #e5e7eb",
                borderRadius: "16px",
                boxShadow:
                  "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                fontWeight: "600",
                padding: "20px 24px",
                minWidth: "350px",
                maxWidth: "600px",
                zIndex: 9999,
                marginTop: "20px",
              },
              className: "rtl",
              success: {
                style: {
                  background: "#f0fdf4",
                  border: "2px solid #22c55e",
                  color: "#166534",
                },
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#f0fdf4",
                },
              },
              error: {
                style: {
                  background: "#fef2f2",
                  border: "2px solid #ef4444",
                  color: "#dc2626",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fef2f2",
                },
              },
            }}
          />
        </AuthProvider>
      </TokenErrorProvider>
    </Provider>
  );
}
