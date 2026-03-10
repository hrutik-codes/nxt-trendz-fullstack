import Order from '../models/Order.js'
import Cart from '../models/Cart.js'

// @route  POST /api/orders
// @access Private
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' })
    }

    // Create order
    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentInfo: { status: 'pending' }
    })

    // Clear cart after order placed
    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] }
    )

    res.status(201).json(order)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/orders/my
// @access Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/orders/:id
// @access Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Make sure user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    res.json(order)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  GET /api/orders
// @access Admin only
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.json(orders)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route  PUT /api/orders/:id
// @access Admin only
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body

    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.orderStatus = orderStatus
    await order.save()

    res.json(order)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
