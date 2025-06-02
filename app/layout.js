// app/layout.js or layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import QueryProvider from "../components/providers/query-provider";
import UserProvider from '../context/userContext' // <-- import here

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your App",
  description: "Project description",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <TooltipProvider>
            <UserProvider> {/* <-- Wrap here */}
              <Toaster />
              <Sonner />
              {children}
            </UserProvider>
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
