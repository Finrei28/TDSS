type SuccessMessageProps = {
  message: string
}

type ErrorMessageProps = {
  message: string
  closeErrorMessage: () => void
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <div
      className="flex items-center justify-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-400 shadow-md"
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-5 h-5 mr-2 text-green-700"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  )
}

export function ErrorMessage({
  message,
  closeErrorMessage,
}: ErrorMessageProps) {
  console.log(message)
  return (
    <div
      className="flex items-center justify-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-400 shadow-md"
      role="alert"
    >
      <svg
        className="flex-shrink-0 w-5 h-5 mr-2 text-red-700 cursor-pointer"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        onClick={closeErrorMessage}
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  )
}
