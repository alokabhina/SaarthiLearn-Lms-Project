import express from 'express'
import PDFDocument from 'pdfkit'

const router = express.Router()

router.post('/generate-invoice', async (req, res) => {
  try {
    const { courseTitle, coursePrice, userName, userEmail } = req.body

    const doc = new PDFDocument()
    let chunks = []

    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks)
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `attachment; filename=${courseTitle}_invoice.pdf`)
      res.send(pdfBuffer)
    })

    // Design invoice content
    doc.fontSize(20).text("🧾 Alok Home Tuition", { align: 'center' })
    doc.moveDown()
    doc.fontSize(12).text(`Invoice No: INV-${Date.now()}`)
    doc.text(`Date: ${new Date().toLocaleDateString()}`)
    doc.text(`Name: ${userName}`)
    doc.text(`Email: ${userEmail}`)
    doc.moveDown()
    doc.text(`Course: ${courseTitle}`)
    doc.text(`Price: ₹${coursePrice}`)
    doc.moveDown()
    doc.text("Thanks for purchasing this course!", { align: 'center' })

    doc.end()
  } catch (error) {
    res.status(500).json({ message: "Failed to generate invoice", error: error.message })
  }
})

export default router
