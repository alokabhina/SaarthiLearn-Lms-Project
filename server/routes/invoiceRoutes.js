import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/generate-invoice', async (req, res) => {
  try {
    const { courseTitle, coursePrice, userName, userEmail } = req.body;

    // Validate input
    if (!courseTitle || !coursePrice || !userName || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doc = new PDFDocument();

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${courseTitle}_invoice.pdf`);

    // Stream PDF to response
    doc.pipe(res);

    // Design invoice content
    doc.fontSize(20).text('🧾 Alok Home Tuition', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: INV-${Date.now()}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Name: ${userName}`);
    doc.text(`Email: ${userEmail}`);
    doc.moveDown();
    doc.text(`Course: ${courseTitle}`);
    doc.text(`Price: ₹${coursePrice}`);
    doc.moveDown();
    doc.text('Thanks for purchasing this course!', { align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate invoice', error: error.message });
  }
});

export default router;