interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="my-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
      <p>{message}</p>
    </div>
  )
}
