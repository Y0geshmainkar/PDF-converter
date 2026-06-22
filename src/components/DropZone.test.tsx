import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import DropZone from '../components/DropZone'

describe('DropZone', () => {
  it('renders browse prompt', () => {
    render(<DropZone onFiles={jest.fn()} mode="pdf-to-word" />)
    expect(screen.getByText(/click to browse/i)).toBeInTheDocument()
  })

  it('shows accepted file types for image', () => {
    render(<DropZone onFiles={jest.fn()} mode="compress-image" />)
    expect(screen.getByText(/\.jpg/i)).toBeInTheDocument()
  })
})
