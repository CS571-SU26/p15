import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">404 — Page not found</h1>
      <Link to="/" className="text-indigo-600 hover:underline dark:text-indigo-400">
        Go back home
      </Link>
    </div>
  )
}
