import React from "react"

type formFieldProps = {
  label?: string
  type: string
  placeholder: string
  name: string
  value: string
  options?: string[]
  selectedgamemodes?: string[]
  error?: boolean
  handlechange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void
}

const FormField = ({
  label,
  type,
  placeholder,
  name,
  value,
  options,
  handlechange,
  selectedgamemodes,
  error,
}: formFieldProps) => {
  return (
    <div className="flex flex-col gap-5 mt-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-900 mt-4"
      >
        {label}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={handlechange}
          className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3 hover: cursor-pointer 
            ${error ? "border-red-500 ring-red-500" : "border-gray-300"}`}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option
              key={option}
              value={option}
              disabled={selectedgamemodes && selectedgamemodes.includes(option)}
              className="hover: cursor-pointer"
            >
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3 
            ${error ? "border-red-500 ring-red-500" : "border-gray-300"} ${
            type === "file" ? "hover: cursor-pointer" : ""
          }`}
          type={type}
          name={name}
          value={value}
          onChange={handlechange}
          placeholder={placeholder}
        />
      )}
    </div>
  )
}

export default FormField
