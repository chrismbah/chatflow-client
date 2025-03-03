// src/app/LayoutClient.tsx (Client Component)
"use client";
import { toastOptions } from "../config/toast";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function LayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster toastOptions={toastOptions} position="bottom-left" />
      {children}
    </QueryClientProvider>
  );
}
