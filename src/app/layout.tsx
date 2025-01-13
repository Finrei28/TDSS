import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import NavBar from "../components/NavBar"
import AuthProvider from "@/components/AuthProvider"
import ErrorBoundary from "@/components/ErrorBoundary" // Import the ErrorBoundary component

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "TDSS",
  description: "Tower Defense Simulator Strategies",
  icons: {
    icon: "/favicon-32x32.ico", // Default 32x32 icon
    apple: "/favicon-192x192.png", // For iOS devices
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add favicon */}
        <head>
          {/* Link to different icon sizes */}
          <link rel="icon" href="/favicon-32x32.ico" sizes="32x32" />
          <link rel="icon" href="/favicon-48x48.ico" sizes="48x48" />
          <link rel="icon" href="/favicon-16x16.ico" sizes="16x16" />
          <link rel="apple-touch-icon" href="/favicon-192x192.png" />
        </head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ErrorBoundary>
            <NavBar />
            <main>{children}</main>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  )
}
