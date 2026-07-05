import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to the placeholder app</h1>
      <p className="max-w-prose text-gray-600">
        This is a placeholder page proving that React, Tailwind CSS, React Router, and
        Vite are wired up correctly. Replace this content with the real project.
      </p>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Count is {count}
      </button>
    </div>
  )
}
