// src/app/LayoutClient.tsx (Client Component)
"use client";
import { toastOptions } from "../config/toast";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <Toaster toastOptions={toastOptions} position="bottom-left" />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
