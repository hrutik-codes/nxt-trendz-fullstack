import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getCart)
router.post('/', protect, addToCart)
router.put('/:productId', protect, updateCartItem)
router.delete('/clear', protect, clearCart)
router.delete('/:productId', protect, removeFromCart)

export default router
