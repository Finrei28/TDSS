import React from "react"

type ContactModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure the user clicked on the overlay, not on the modal content
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="relative bg-white rounded-lg p-10 shadow-lg">
            {/* X Button */}
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 focus:outline-none text-lg"
              aria-label="Close"
            >
              ✖
            </button>

            {/* Modal Content */}
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-2xl font-bold mb-4">Contact Information</h1>
              <p className="text-center text-gray-700 mb-4">
                Please contact us through our email at admin@tdss.site
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ContactModal
