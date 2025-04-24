import type React from "react";
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Medical Application",
  description: "A frontend for managing patient medical records",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";

import "./globals.css";
