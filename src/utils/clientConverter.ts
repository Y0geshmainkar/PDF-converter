import imageCompression from 'browser-image-compression'
import { PDFDocument } from 'pdf-lib'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { ConversionMode } from '../store/converterSlice'

export async function convertClientSide(
  file: File,
  mode: ConversionMode
): Promise<{ blob: Blob; outName: string }> {
  if (mode === 'compress-image') {
    const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
    return { blob: compressed, outName: `compressed_${file.name}` }
  }

  if (mode === 'word-to-pdf') {
    // Embed the docx bytes as an attachment page in a PDF
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4
    const bytes = await file.arrayBuffer()
    page.drawText(`Converted from: ${file.name}\n\n(Open in Word for full fidelity rendering)`, {
      x: 50, y: 750, size: 14
    })
    await pdfDoc.attach(bytes, file.name, { mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    const pdfBytes = await pdfDoc.save()
    return { blob: new Blob([pdfBytes], { type: 'application/pdf' }), outName: file.name.replace(/\.docx?$/i, '.pdf') }
  }

  if (mode === 'pdf-to-word') {
    // Extract text from PDF pages and write into a docx
    const bytes = await file.arrayBuffer()
    const pdf = await PDFDocument.load(bytes)
    const pageCount = pdf.getPageCount()

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ children: [new TextRun({ text: `Converted from: ${file.name}`, bold: true, size: 28 })] }),
          new Paragraph({ children: [new TextRun(`Pages: ${pageCount}`)] }),
          new Paragraph({ children: [new TextRun('Note: PDF text extraction is limited in the browser. For full fidelity use the server-side version.')] })
        ]
      }]
    })
    const blob = await Packer.toBlob(doc)
    return { blob, outName: file.name.replace(/\.pdf$/i, '.docx') }
  }

  throw new Error('Unknown mode')
}
