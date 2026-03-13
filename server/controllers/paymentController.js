import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../models/Order.js'

// @route  POST /api/payment/create-order
// @access Private
export const createPaymentOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })

    const { amount } = req.body

    const options = {
      amount: Math.round(amount * 100), // Razorpay needs paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    }

    const order = await razorpay.orders.create(options)
    res.json(order)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  POST /api/payment/verify
// @access Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body

    // Generate expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    console.log('Expected:', expectedSignature)
    console.log('Received:', razorpay_signature)

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      // Still update order in test mode
      if (process.env.NODE_ENV === 'development') {
        await Order.findByIdAndUpdate(orderId, {
          'paymentInfo.paymentId': razorpay_payment_id,
          'paymentInfo.status': 'paid'
        })
        return res.json({
          success: true,
          message: 'Payment verified successfully (dev mode)',
          paymentId: razorpay_payment_id
        })
      }
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    await Order.findByIdAndUpdate(orderId, {
      'paymentInfo.paymentId': razorpay_payment_id,
      'paymentInfo.status': 'paid'
    })

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/payment/key
// @access Private
export const getRazorpayKey = async (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID })
}
