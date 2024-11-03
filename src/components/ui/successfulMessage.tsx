type SuccessMessageProps = {
  message: string
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
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
