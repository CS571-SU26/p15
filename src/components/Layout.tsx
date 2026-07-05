import { NavLink, Outlet } from 'react-router-dom'

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? 'bg-indigo-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-lg font-semibold text-gray-900">React Hub</span>
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            About
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Built with React, Tailwind CSS, React Router, and Vite.
      </footer>
    </div>
  )
}
