import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { PrismaClient } from "@prisma/client"
import { StrategyType, User } from "@/components/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { generateSlug } from "@/components/utils"
import LikedStrategies from "@/components/dashboard/likedcomponent"

const prisma = new PrismaClient()

const likedStrats = async () => {
  // Fetch the session
  const session = await getServerSession(authOptions)

  if (!session) {
    // Redirect if not authenticated
    redirect("/api/auth/signin?callbackUrl=/dashboard")
  }

  // Fetch data for strategies
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-5 bg-gray-100">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-700 mb-6">
            Liked Strats
          </h2>
          <LikedStrategies />
        </main>
      </div>
    </div>
  )
}

export default likedStrats
