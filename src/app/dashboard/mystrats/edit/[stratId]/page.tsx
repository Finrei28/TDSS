import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { redirect } from "next/navigation"
import React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import EditComponent from "@/components/dashboard/EditComponent"

const page = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    // Redirect if not authenticated
    redirect("/api/auth/signin?callbackUrl=/dashboard/mystrats/edit/[stratId]")
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-5 bg-gray-100 sm:ml-64">
          <EditComponent userId={session.user.id} />
        </main>
      </div>
    </div>
  )
}

export default page
