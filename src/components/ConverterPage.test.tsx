import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import converterReducer from '../store/converterSlice'
import ConverterPage from './ConverterPage'

jest.mock('../utils/clientConverter', () => ({
  convertClientSide: jest.fn().mockResolvedValue({ blob: new Blob(), outName: 'out.docx' })
}))

const renderPage = () => {
  const store = configureStore({ reducer: { converter: converterReducer } })
  return render(<Provider store={store}><ConverterPage /></Provider>)
}

describe('ConverterPage', () => {
  it('renders all mode tabs', () => {
    renderPage()
    expect(screen.getByText(/PDF → Word/i)).toBeInTheDocument()
    expect(screen.getByText(/Word → PDF/i)).toBeInTheDocument()
    expect(screen.getByText(/Compress Image/i)).toBeInTheDocument()
  })

  it('switches active mode on tab click', () => {
    renderPage()
    const tab = screen.getByText(/Word → PDF/i)
    fireEvent.click(tab)
    expect(tab).toHaveAttribute('aria-selected', 'true')
  })

  it('does not show Clear All button when no jobs', () => {
    renderPage()
    expect(screen.queryByText(/Clear All/i)).not.toBeInTheDocument()
  })
})
