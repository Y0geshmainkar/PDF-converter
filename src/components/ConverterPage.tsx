import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { setMode, clearJobs, convertFile, ConversionMode } from '../store/converterSlice'
import DropZone from './DropZone'
import JobList from './JobList'
import styles from './ConverterPage.module.scss'

const MODES: { value: ConversionMode; label: string }[] = [
  { value: 'pdf-to-word', label: '📄 PDF → Word' },
  { value: 'word-to-pdf', label: '📝 Word → PDF' },
  { value: 'compress-image', label: '🖼️ Compress Image' }
]

export default function ConverterPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { activeMode, jobs } = useSelector((s: RootState) => s.converter)

  const handleFiles = (files: File[]) => {
    files.forEach((file) => dispatch(convertFile({ file, mode: activeMode })))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>ConverterApp</h1>
        <p>PDF ↔ Word · Image Compression</p>
      </header>

      <main className={styles.main}>
        <nav className={styles.modeNav} role="tablist" aria-label="Conversion mode">
          {MODES.map((m) => (
            <button
              key={m.value}
              role="tab"
              aria-selected={activeMode === m.value}
              className={`${styles.modeTab} ${activeMode === m.value ? styles.active : ''}`}
              onClick={() => dispatch(setMode(m.value))}
            >
              {m.label}
            </button>
          ))}
        </nav>

        <DropZone onFiles={handleFiles} mode={activeMode} />

        {jobs.length > 0 && (
          <>
            <JobList jobs={jobs} />
            <button className={styles.clearBtn} onClick={() => dispatch(clearJobs())}>
              Clear All
            </button>
          </>
        )}
      </main>
    </div>
  )
}
