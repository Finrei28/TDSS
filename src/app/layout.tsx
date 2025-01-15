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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
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
