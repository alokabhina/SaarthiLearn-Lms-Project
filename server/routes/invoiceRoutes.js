import express from 'express';
import { generateInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

// POST route to generate invoice
router.post('/generate', generateInvoice);

export default router;
