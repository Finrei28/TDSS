declare module "@headlessui/react" {
  import { Dialog as HeadlessDialog } from "@headlessui/react"

  export const Dialog: HeadlessDialog & {
    Overlay: React.FC<DialogOverlayProps>
  }

  export interface DialogOverlayProps {
    className?: string
    children?: React.ReactNode
    open?: boolean
    onClose?: () => void
  }
}
