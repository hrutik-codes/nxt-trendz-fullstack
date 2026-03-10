import Cart from '../models/Cart.js'

// @route  GET /api/cart
// @access Private
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.json({ items: [] })
    }
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  POST /api/cart
// @access Private
export const addToCart = async (req, res) => {
  try {
    const { productId, title, price, image, quantity } = req.body

    let cart = await Cart.findOne({ userId: req.user._id })

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, title, price, image, quantity }]
      })
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find(
        item => item.productId === productId
      )

      if (existingItem) {
        // Increase quantity if already in cart
        existingItem.quantity += quantity
      } else {
        // Add new item
        cart.items.push({ productId, title, price, image, quantity })
      }
    }

    await cart.save()
    res.status(201).json(cart)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  PUT /api/cart/:productId
// @access Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body
    const { productId } = req.params

    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(item => item.productId === productId)
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    item.quantity = quantity
    await cart.save()
    res.json(cart)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  DELETE /api/cart/:productId
// @access Private
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter(item => item.productId !== productId)
    await cart.save()
    res.json(cart)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  DELETE /api/cart
// @access Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = []
    await cart.save()
    res.json({ message: 'Cart cleared successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
