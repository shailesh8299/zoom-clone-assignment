import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Zoom",
  description: "Zoom Clone Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#1C1C1C]">{children}</body>
    </html>
  );
}
