import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import './index.css'
import App from './App.tsx'
import { ParksProvider } from './context/ParksContext'
import { PreferencesProvider } from './context/PreferencesContext'

// Leaflet's default marker icon URLs are relative to the page and 404 once
// bundled by Vite (doubly so under the /p15/ GH Pages base path) — point
// them at the bundler-resolved asset URLs instead. The subclass override of
// _getIconUrl always prepends an auto-detected imagePath in front of
// options.iconUrl, even when it's already a full URL, so it must be deleted
// to fall back to the base Icon's _getIconUrl (no prefixing).
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/p15">
      <PreferencesProvider>
        <ParksProvider>
          <App />
        </ParksProvider>
      </PreferencesProvider>
    </BrowserRouter>
  </StrictMode>,
)
