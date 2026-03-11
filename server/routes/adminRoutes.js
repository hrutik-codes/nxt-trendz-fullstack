import express from 'express'
import {
  getAllUsers,
  deleteUser,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/adminController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import {
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js'

const router = express.Router()

// User routes
router.get('/users', protect, admin, getAllUsers)
router.delete('/users/:id', protect, admin, deleteUser)

// Product routes
router.get('/products', protect, admin, getAllProducts)
router.post('/products', protect, admin, createProduct)
router.put('/products/:id', protect, admin, updateProduct)
router.delete('/products/:id', protect, admin, deleteProduct)

// Order routes
router.get('/orders', protect, admin, getAllOrders)
router.put('/orders/:id', protect, admin, updateOrderStatus)

export default router
