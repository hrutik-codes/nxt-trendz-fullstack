import User from '../models/User.js'
import Product from '../models/Product.js'

// ── USER MANAGEMENT ──────────────────────────

// @route  GET /api/admin/users
// @access Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  DELETE /api/admin/users/:id
// @access Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.isAdmin) {
      return res.status(400).json({ message: 'Cannot delete admin user' })
    }
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── PRODUCT MANAGEMENT ───────────────────────

// @route  GET /api/admin/products
// @access Admin
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  POST /api/admin/products
// @access Admin
export const createProduct = async (req, res) => {
  try {
    const { title, price, description, image, category, stock } = req.body
    const product = await Product.create({
      title, price, description,
      image, category, stock
    })
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  PUT /api/admin/products/:id
// @access Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  DELETE /api/admin/products/:id
// @access Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
