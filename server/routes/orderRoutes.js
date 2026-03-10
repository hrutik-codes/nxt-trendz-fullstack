import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', protect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/', protect, admin, getAllOrders)
router.get('/:id', protect, getOrderById)
router.put('/:id', protect, admin, updateOrderStatus)

export default router
