"use client"

import { DashboardSidebar } from "@/components/dashboard/sidebar"
import Loader from "@/components/loader"
import { useState, useEffect } from "react"

const DonationTable = () => {
  const [donations, setDonations] = useState<any[]>([]) // Type according to your data structure
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDonations = async () => {
      const res = await fetch("/api/donation/get")
      const data = await res.json()
      console.log(data)
      setDonations(data)
      setLoading(false)
    }

    fetchDonations()
  }, [])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-row">
      <DashboardSidebar />
      <main className="flex-1 bg-gray-100 sm:ml-64 ">
        {loading ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.5rem)]">
            <Loader />
          </div>
        ) : (
          <div className="">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 w-full">
                  <th className="px-4 py-2 text-center hidden sm:table-cell">
                    Donation ID
                  </th>
                  <th className="px-4 py-2 text-center">Amount</th>
                  <th className="px-4 py-2 text-center">Date</th>
                  <th className="px-4 py-2 text-center">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b">
                    <td className="px-4 py-2 text-center hidden sm:table-cell">
                      {donation.id}
                    </td>
                    <td className="px-4 py-2 text-center">
                      ${donation.amount}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {donation.paymentMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default DonationTable
