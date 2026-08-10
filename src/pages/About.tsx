export default function About() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">About</h1>
      <p className="max-w-prose text-gray-600 dark:text-gray-400">
        The Wisconsin State Park Tracker helps you browse, filter, and keep track of which
        of Wisconsin's ~80 state parks, forests, recreation areas, and river &amp; resource
        areas you've visited. Explore properties on an interactive map or as a searchable
        card list, mark parks as visited to build your own My Parks list, and sort by name,
        acreage, or distance from your location.
      </p>
      <p className="max-w-prose text-gray-600 dark:text-gray-400">
        Park locations and property details come from the Wisconsin DNR's public GIS data;
        descriptions and photos, where available, come from Wikipedia. Everything runs
        entirely in your browser — your visited-parks list, theme, and other preferences
        are stored locally on your device, never sent to a server.
      </p>
      <p className="max-w-prose text-gray-600 dark:text-gray-400">
        Built with React, TypeScript, Vite, Tailwind CSS, and Leaflet, as a final project
        for UW–Madison's CS571.
      </p>
    </div>
  )
}
