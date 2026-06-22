import converterReducer, { setMode, clearJobs, ConversionMode } from '../store/converterSlice'

const initial = converterReducer(undefined, { type: '@@INIT' })

describe('converterSlice', () => {
  it('sets active mode', () => {
    const state = converterReducer(initial, setMode('word-to-pdf'))
    expect(state.activeMode).toBe('word-to-pdf')
  })

  it('clears jobs', () => {
    const withJob = {
      ...initial,
      jobs: [{ id: '1', mode: 'pdf-to-word' as ConversionMode, fileName: 'a.pdf', status: 'done' as const }]
    }
    const state = converterReducer(withJob, clearJobs())
    expect(state.jobs).toHaveLength(0)
  })
})
