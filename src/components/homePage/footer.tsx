import Link from "next/link"

const Footer = ({ openModal }: { openModal: () => void }) => {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} TDSS. All rights reserved.
        </p>
        <nav className="mt-4 flex justify-center space-x-4">
          <Link
            href="/about"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/donate"
            className="hover:text-gray-400 transition-colors duration-200"
          >
            Donate
          </Link>
          <a
            onClick={openModal}
            className="hover:text-gray-400 transition-colors duration-200 cursor-pointer"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
