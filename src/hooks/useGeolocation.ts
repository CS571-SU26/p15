import { useState } from 'react'

function describeError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'Location permission denied.'
    case err.POSITION_UNAVAILABLE:
      return 'Your location is unavailable right now.'
    case err.TIMEOUT:
      return 'Timed out getting your location.'
    default:
      return err.message || 'Could not get your location.'
  }
}

export function useGeolocation() {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function request() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
        setLoading(false)
      },
      (err) => {
        setError(describeError(err))
        setLoading(false)
      },
      // Some browsers (notably Safari on macOS when Location Services is
      // off at the OS level) never call either callback instead of erroring
      // promptly on denial — an explicit timeout guarantees the error
      // callback fires so the button doesn't stay stuck on "Locating…".
      { timeout: 10000 },
    )
  }

  return { position, error, loading, request }
}
