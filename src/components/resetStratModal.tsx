import React from "react"
import Modal from "./ui/modal"
import { Button } from "./ui/button"

type ResetStratModalProps = {
  isOpen: boolean
  onClose: () => void
  handleSubmit?: () => void // Add your own submit logic here
}

const ResetStratModal = ({
  isOpen,
  onClose,
  handleSubmit,
}: ResetStratModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col justify-center items-center">
        <div>
          <h1 className="flex justify-center text-3xl font-bold">
            Reset Confirmation
          </h1>
          <h2 className="flex justify-center text-base mt-5 mb-5 text-center">
            You're about to reset the strategy you're creating.
          </h2>
          <div className="flex justify-center gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-red-500 hover:bg-red-300 flex-grow text-center max-w-[100px]"
            >
              Yes, reset
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-grow text-center max-w-[100px]"
            >
              Never Mind
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ResetStratModal
