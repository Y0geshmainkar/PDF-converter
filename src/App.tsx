import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ConverterPage from './components/ConverterPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConverterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
