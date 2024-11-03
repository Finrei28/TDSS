import React from "react"
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

const prisma = new PrismaClient()

const myStrats = async () => {
  // Fetch the session
  const session = await getServerSession(authOptions)

  if (!session) {
    // Redirect if not authenticated
    redirect("/api/auth/signin?callbackUrl=/dashboard")
  }

  // Fetch data for strategies
  let data: { strategies: StrategyType[] } | null = null
  try {
    data = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        strategies: {
          include: {
            map: true, // Only include the related `map` data if needed.
          },
        },
      },
    })
  } catch (error) {
    console.error("Error fetching strategies:", error)
  } finally {
    await prisma.$disconnect()
  }
  console.log(data)
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 bg-gray-100">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-700 mb-6">
            My Strats
          </h2>
          {data && data.strategies.length > 0 ? (
            <div className="grid gap-6 w-full 2xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 lg:w-4/6 p-4">
              {data.strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="relative rounded-lg shadow-lg overflow-hidden bg-white flex flex-col"
                >
                  {strategy.map?.image && (
                    <div className="relative w-full h-64">
                      <Image
                        src={strategy.map.image} // Replace with your actual image URL
                        alt={strategy.map.name || "Map Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">
                      {strategy.name}
                    </h3>
                    <div className="mt-2 text-md font-bold text-gray-400">
                      <p>Map: {strategy.map?.name}</p>
                      <p>Gamemode: {strategy.gamemode}</p>
                      {strategy.inGameGamemode && (
                        <p>In Game Difficulty: {strategy.inGameGamemode}</p>
                      )}
                      <p>
                        Players required:{" "}
                        {strategy.numOfPlayer === "ONE"
                          ? 1
                          : strategy.numOfPlayer === "TWO"
                          ? 2
                          : strategy.numOfPlayer === "THREE"
                          ? 3
                          : 4}
                      </p>
                      <p>Difficulty: {strategy.difficulty}</p>
                      <p>Description: {strategy.description}</p>
                      <p>
                        Created:{" "}
                        {formatDistanceToNow(new Date(strategy.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-5 m-5">
                    <Link href="/" className="flex-1">
                      <Button className="w-full px-8 py-2" type="button">
                        Edit
                      </Button>
                    </Link>

                    <Link
                      href={`/${strategy.gamemode.toLowerCase()}/${generateSlug(
                        strategy.map?.name
                      )}/Strat/${strategy.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full px-8 py-2" type="button">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center min-h-screen -mt-40">
              <div
                className="text-gray-600 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">
                  You haven't posted any strategies to the community yet.
                </strong>
              </div>
              <p className="mt-4 text-gray-600">
                <Link href="/createstrategy" className="text-primary">
                  Click here {""}
                </Link>
                to start sharing your strategies and help others!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default myStrats
