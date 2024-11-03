export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
) {
  let timeoutId: NodeJS.Timeout | undefined

  return (...args: Parameters<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args)
    }, delay)
  }
}
