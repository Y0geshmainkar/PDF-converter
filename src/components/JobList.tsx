import React from 'react'
import { ConversionJob } from '../store/converterSlice'
import styles from './JobList.module.scss'

interface Props { jobs: ConversionJob[] }

const STATUS_LABEL: Record<ConversionJob['status'], string> = {
  uploading: 'Converting…',
  done: 'Done',
  error: 'Error'
}

export default function JobList({ jobs }: Props) {
  return (
    <ul className={styles.list} aria-label="Conversion jobs">
      {jobs.map((job) => (
        <li key={job.id} className={`${styles.item} ${styles[job.status]}`}>
          <span className={styles.name}>{job.fileName}</span>
          <span className={styles.badge}>{STATUS_LABEL[job.status]}</span>
          {job.status === 'done' && job.downloadUrl && (
            <a href={job.downloadUrl} download className={styles.download}>
              ⬇ Download
            </a>
          )}
          {job.status === 'error' && (
            <span className={styles.error}>{job.errorMsg}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
