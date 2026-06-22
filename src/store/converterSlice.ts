import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { convertClientSide } from '../utils/clientConverter'

export type ConversionMode = 'pdf-to-word' | 'word-to-pdf' | 'compress-image'

export interface ConversionJob {
  id: string
  mode: ConversionMode
  fileName: string
  status: 'uploading' | 'done' | 'error'
  downloadUrl?: string
  errorMsg?: string
}

export interface ConverterState {
  jobs: ConversionJob[]
  activeMode: ConversionMode
}

const initialState: ConverterState = { jobs: [], activeMode: 'pdf-to-word' }

export const convertFile = createAsyncThunk(
  'converter/convertFile',
  async ({ file, mode }: { file: File; mode: ConversionMode }) => {
    const { blob, outName } = await convertClientSide(file, mode)
    const downloadUrl = URL.createObjectURL(blob)
    return { fileName: file.name, downloadUrl, outName }
  }
)

const converterSlice = createSlice({
  name: 'converter',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<ConversionMode>) {
      state.activeMode = action.payload
    },
    clearJobs(state) {
      state.jobs = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertFile.pending, (state, action) => {
        state.jobs.push({
          id: action.meta.requestId,
          mode: action.meta.arg.mode,
          fileName: action.meta.arg.file.name,
          status: 'uploading'
        })
      })
      .addCase(convertFile.fulfilled, (state, action) => {
        const job = state.jobs.find((j) => j.id === action.meta.requestId)
        if (job) { job.status = 'done'; job.downloadUrl = action.payload.downloadUrl }
      })
      .addCase(convertFile.rejected, (state, action) => {
        const job = state.jobs.find((j) => j.id === action.meta.requestId)
        if (job) { job.status = 'error'; job.errorMsg = action.error.message }
      })
  }
})

export const { setMode, clearJobs } = converterSlice.actions
export default converterSlice.reducer
