import React from "react"
import { authOptions } from "../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

// Main Dashboard Component
const Dashboard: React.FC = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard")
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <DashboardSidebar />
      <main className="flex-1 p-6 bg-gray-100 sm:ml-64">
        <h2 className="text-xl md:text-3xl font-semibold text-gray-700 mb-6">
          Profile
        </h2>
        <div className="grid grid-cols-1 gap-6 lg:w-2/5">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Username</h3>
            <p className="mt-2 text-2xl font-bold text-primary">
              {session.user.username}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Email</h3>
            <p className="mt-2 text-2xl font-bold text-primary">
              {session.user.email}
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Password</h3>
            <p className="mt-2 text-2xl font-bold text-primary">
              **************
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
