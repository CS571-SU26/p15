import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import MyParks from './pages/MyParks'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="my-parks" element={<MyParks />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
