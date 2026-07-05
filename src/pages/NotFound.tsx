import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900">404 — Page not found</h1>
      <Link to="/" className="text-indigo-600 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
