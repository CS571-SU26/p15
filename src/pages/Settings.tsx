import { useParks } from '../hooks/useParks'
import { usePreferences } from '../hooks/usePreferences'

export default function Settings() {
  const { theme, setTheme, reducedMotion, setReducedMotion } = usePreferences()
  const { clearVisited } = useParks()

  function handleClearVisited() {
    if (window.confirm("Clear all parks you've marked as visited? This can't be undone.")) {
      clearVisited()
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>

      <section className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Dark mode</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Switch between light and dark appearance.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              theme === 'light'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              theme === 'dark'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Dark
          </button>
        </div>
      </section>

      <section className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Reduce motion</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Skip the map's fly-to animation when highlighting a park.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setReducedMotion(false)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              !reducedMotion
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Off
          </button>
          <button
            type="button"
            onClick={() => setReducedMotion(true)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              reducedMotion
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            On
          </button>
        </div>
      </section>

      <section className="flex items-center justify-between gap-4 rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">Visited parks</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Remove every park from your My Parks list.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearVisited}
          className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
        >
          Clear all visited parks
        </button>
      </section>
    </div>
  )
}
