// app/providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "@teispace/next-themes";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <HeroUIProvider>
        {children}
        <Toaster />
      </HeroUIProvider>
    </ThemeProvider>
  );
}
