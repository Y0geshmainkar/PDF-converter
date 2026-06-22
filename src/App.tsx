import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import ConverterPage from './components/ConverterPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ConverterPage />} />
      </Routes>
    </HashRouter>
  )
}
