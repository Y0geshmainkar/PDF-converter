import React, { useRef, useState, DragEvent } from 'react'
import { ConversionMode } from '../store/converterSlice'
import styles from './DropZone.module.scss'

const ACCEPT: Record<ConversionMode, string> = {
  'pdf-to-word': '.pdf',
  'word-to-pdf': '.doc,.docx',
  'compress-image': '.jpg,.jpeg,.png,.webp'
}

interface Props {
  onFiles: (files: File[]) => void
  mode: ConversionMode
}

export default function DropZone({ onFiles, mode }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    onFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div
      className={`${styles.zone} ${dragging ? styles.dragging : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Drop files here or click to browse"
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPT[mode]}
        multiple
        onChange={(e) => e.target.files && onFiles(Array.from(e.target.files))}
      />
      <span className={styles.icon}>⬆️</span>
      <p>Drop files here or <strong>click to browse</strong></p>
      <small>Accepted: {ACCEPT[mode]}</small>
    </div>
  )
}
