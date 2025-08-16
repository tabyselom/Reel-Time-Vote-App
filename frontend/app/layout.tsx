import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "QuickPoll",
  description: "A Real-Time Polling Application",
  icons: {
    icon: "/QuickPollIcon.svg",
  },
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" bg-[#0d1b25]">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
