import express from 'express'
import {
  createPaymentOrder,
  verifyPayment,
  getRazorpayKey
} from '../controllers/paymentController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/key', protect, getRazorpayKey)
router.post('/create-order', protect, createPaymentOrder)
router.post('/verify', protect, verifyPayment)

export default router
