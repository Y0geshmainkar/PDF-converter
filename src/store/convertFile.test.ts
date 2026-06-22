import converterReducer, { convertFile, ConversionJob } from './converterSlice'

jest.mock('../utils/clientConverter', () => ({
  convertClientSide: jest.fn()
}))

import { convertClientSide } from '../utils/clientConverter'
const mockConvert = convertClientSide as jest.Mock

const mockFile = (name = 'test.pdf') => ({ name } as File)

describe('convertFile thunk', () => {
  const initial = converterReducer(undefined, { type: '@@INIT' })

  it('adds uploading job on pending', () => {
    const action = convertFile.pending('req-1', { file: mockFile(), mode: 'pdf-to-word' })
    const state = converterReducer(initial, action)
    expect(state.jobs[0]).toMatchObject({ id: 'req-1', status: 'uploading', fileName: 'test.pdf' })
  })

  it('marks job done by requestId on fulfilled', () => {
    const pending = convertFile.pending('req-1', { file: mockFile(), mode: 'pdf-to-word' })
    let state = converterReducer(initial, pending)
    const fulfilled = convertFile.fulfilled(
      { fileName: 'test.pdf', downloadUrl: 'blob:x', outName: 'test.docx' },
      'req-1',
      { file: mockFile(), mode: 'pdf-to-word' }
    )
    state = converterReducer(state, fulfilled)
    expect(state.jobs[0]).toMatchObject({ status: 'done', downloadUrl: 'blob:x' })
  })

  it('marks correct job done when two files have the same name', () => {
    const file = mockFile('a.pdf')
    let state = converterReducer(initial, convertFile.pending('req-1', { file, mode: 'pdf-to-word' }))
    state = converterReducer(state, convertFile.pending('req-2', { file, mode: 'pdf-to-word' }))
    state = converterReducer(state, convertFile.fulfilled(
      { fileName: 'a.pdf', downloadUrl: 'blob:1', outName: 'a.docx' }, 'req-1', { file, mode: 'pdf-to-word' }
    ))
    expect(state.jobs[0]).toMatchObject({ id: 'req-1', status: 'done' })
    expect(state.jobs[1]).toMatchObject({ id: 'req-2', status: 'uploading' })
  })

  it('marks job error by requestId on rejected', () => {
    let state = converterReducer(initial, convertFile.pending('req-1', { file: mockFile(), mode: 'pdf-to-word' }))
    const rejected = convertFile.rejected(new Error('fail'), 'req-1', { file: mockFile(), mode: 'pdf-to-word' })
    state = converterReducer(state, rejected)
    expect(state.jobs[0]).toMatchObject({ status: 'error', errorMsg: 'fail' })
  })
})
