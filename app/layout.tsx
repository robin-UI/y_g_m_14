import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
// import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
// import ChatIcon from "@/components/chat/ChatIcon";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import SessionProvider from "@/providers/SessionProvider";
import { StoreProvider } from "@/providers/store-provider";

export const metadata: Metadata = {
  title: "You Got A Mentor | Your career path to success",
  description:
    "Your personalized journey to career success with expert mentorship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-grey-100/30">
        <SessionProvider>
          <StoreProvider>
            <QueryProvider>
              <Toaster />
              {children}
            </QueryProvider>
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
