import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/features/auth/auth.provider";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    title: "ORB",
    description: "ORB - Teachers & Students Platform",
    icons: {
        icon: "/favicon.svg",
    },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon من الجذر عشان يظهر في التاب */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${tajawal.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
