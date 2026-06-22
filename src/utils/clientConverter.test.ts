import { convertClientSide } from './clientConverter'

jest.mock('browser-image-compression', () =>
  jest.fn().mockResolvedValue(new Blob(['compressed'], { type: 'image/jpeg' }))
)
jest.mock('pdf-lib', () => ({
  PDFDocument: {
    create: jest.fn().mockResolvedValue({
      addPage: jest.fn().mockReturnValue({ drawText: jest.fn() }),
      attach: jest.fn(),
      save: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3]))
    }),
    load: jest.fn().mockResolvedValue({ getPageCount: () => 2 })
  }
}))
jest.mock('docx', () => ({
  Document: jest.fn(),
  Packer: { toBlob: jest.fn().mockResolvedValue(new Blob(['docx'])) },
  Paragraph: jest.fn(),
  TextRun: jest.fn()
}))

const makeFile = (name: string, type = 'application/pdf') => {
  const f = new File(['data'], name, { type })
  f.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(4))
  return f
}

describe('clientConverter', () => {
  it('compress-image returns compressed blob', async () => {
    const { blob, outName } = await convertClientSide(makeFile('photo.jpg', 'image/jpeg'), 'compress-image')
    expect(blob).toBeInstanceOf(Blob)
    expect(outName).toBe('compressed_photo.jpg')
  })

  it('word-to-pdf returns pdf blob', async () => {
    const { blob, outName } = await convertClientSide(makeFile('doc.docx'), 'word-to-pdf')
    expect(blob.type).toBe('application/pdf')
    expect(outName).toBe('doc.pdf')
  })

  it('pdf-to-word returns docx blob', async () => {
    const { blob, outName } = await convertClientSide(makeFile('file.pdf'), 'pdf-to-word')
    expect(blob).toBeInstanceOf(Blob)
    expect(outName).toBe('file.docx')
  })

  it('throws on unknown mode', async () => {
    await expect(convertClientSide(makeFile('x'), 'unknown' as any)).rejects.toThrow('Unknown mode')
  })
})
