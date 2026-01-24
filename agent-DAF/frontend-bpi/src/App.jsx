import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ImportInvoice from './pages/ImportInvoice'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/import" element={<ImportInvoice />} />
      </Routes>
    </BrowserRouter>
  )
}
