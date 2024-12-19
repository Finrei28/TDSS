"use client"

import { useEffect } from "react"

export function useFetchData(
  url: string,
  onSuccess: (data: any) => void,
  setLoading?: (data: boolean) => void
) {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url)
      const data = await response.json()
      onSuccess(data)
      if (setLoading) {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, onSuccess, setLoading]) // Runs whenever `url` or `onSuccess` changes
}
