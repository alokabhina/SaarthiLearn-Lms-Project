import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;

    const doc = new PDFDocument({ margin: 50 });

    // Path to save PDF
    const filePath = path.join('invoices', `invoice-${Date.now()}.pdf`);

    // Stream to file and response
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.pipe(res);

    // --- Header ---
    doc.fontSize(22).text('Alok Home Tuition', { align: 'center' });
    doc.fontSize(10).text('Affordable & Quality Education', { align: 'center' });
    doc.moveDown();
    doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`);
    doc.text(`Invoice Number: INV-${Date.now()}`);
    doc.moveDown();

    // --- Billing Info ---
    doc.fontSize(12).text(`To: ${invoiceData.studentName}`);
    doc.text(`Phone: ${invoiceData.phone}`);
    doc.moveDown();

    // --- Table Header ---
    doc.fontSize(14).text('Course Details', { underline: true });
    doc.fontSize(12);
    doc.text(`Course Name: ${invoiceData.courseName}`);
    doc.text(`Duration: ${invoiceData.duration}`);
    doc.text(`Fee: ₹${invoiceData.amount}`);
    doc.text(`Discount: ₹${invoiceData.discount || 0}`);
    doc.text(`Total Paid: ₹${invoiceData.amount - (invoiceData.discount || 0)}`);
    doc.moveDown();

    // --- Footer ---
    doc.fontSize(10).text('Thank you for choosing Alok Home Tuition.', { align: 'center' });
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};
