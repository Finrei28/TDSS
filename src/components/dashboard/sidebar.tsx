import Link from "next/link"
import MobileSideBar from "./mobileSideBar"

export const DashboardSidebar = () => {
  return (
    <>
      <aside className="hidden sm:block sm:w-64 bg-primary text-white h-full px-4 py-6 text-lg fixed z-10">
        <ul className="space-y-4">
          <li>
            <Link
              href="/dashboard"
              className="block hover:text-primary hover:bg-white p-2 rounded-lg"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/mystrats"
              className="block hover:text-primary hover:bg-white p-2 rounded-lg"
            >
              My Strats
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/likedstrats"
              className="block hover:text-primary hover:bg-white p-2 rounded-lg"
            >
              Liked Strats
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/donations"
              className="block hover:text-primary hover:bg-white p-2 rounded-lg"
            >
              Donations
            </Link>
          </li>
        </ul>
      </aside>
      <MobileSideBar />
    </>
  )
}
