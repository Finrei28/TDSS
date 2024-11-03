// src/components/ui/modal.tsx
"use client"

import React, { ReactNode } from "react"
import { Dialog } from "@headlessui/react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black opacity-65" />
        <div className="bg-slate-50 rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✖
            </button>
            {children}
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default Modal
