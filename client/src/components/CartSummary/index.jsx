import {Component} from 'react'
import CartContext from '../../context/CartContext'
import {apiCall} from '../../utils/api'
import './index.css'

class CartSummary extends Component {
  state = {
    isLoading: false,
    error: '',
  }

  loadRazorpayScript = () =>
    new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  handleCheckout = async (cartList, removeAllCartItems) => {
    this.setState({isLoading: true, error: ''})

    try {
      // Load Razorpay script
      const scriptLoaded = await this.loadRazorpayScript()
      if (!scriptLoaded) {
        this.setState({error: 'Payment gateway failed to load. Try again.'})
        return
      }

      // Get Razorpay Key
      const {key} = await apiCall('/api/payment/key')

      // Calculate total
      const totalAmount = cartList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      )

      // Create Razorpay order
      const orderData = await apiCall('/api/payment/create-order', {
        method: 'POST',
        body: JSON.stringify({amount: totalAmount}),
      })

      // Place order in your DB first
      const placedOrder = await apiCall('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: cartList.map(item => ({
            productId: String(item.id),
            title: item.title,
            price: item.price,
            image: item.imageUrl,
            quantity: item.quantity,
          })),
          totalAmount,
          shippingAddress: {
            fullName: 'Hrutik Jagdale',
            address: '123 Main Street',
            city: 'Pune',
            pincode: '411001',
            phone: '9999999999',
          },
        }),
      })

      // Open Razorpay popup
      const options = {
        key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'NxtTrendz',
        description: 'Purchase from NxtTrendz',
        order_id: orderData.id,
        handler: async response => {
          try {
            await apiCall('/api/payment/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: placedOrder._id,
              }),
            })
            // Clear backend cart explicitly
            await apiCall('/api/cart/clear', {method: 'DELETE'})
            // Clear frontend state
            removeAllCartItems()
            alert('Payment Successful! 🎉 Order placed successfully.')
          } catch (err) {
            console.error('Verification error:', err.message)
            this.setState({error: err.message || 'Payment verification failed.'})
          }
        },
        prefill: {
          name: 'Hrutik Jagdale',
          email: 'hrutik@test.com',
        },
        theme: {color: '#0b69ff'},
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (err) {
      this.setState({error: err.message || 'Something went wrong.'})
    } finally {
      this.setState({isLoading: false})
    }
  }

  render() {
    const {isLoading, error} = this.state

    return (
      <CartContext.Consumer>
        {value => {
          const {cartList, removeAllCartItems} = value
          const totalItems = cartList.length
          const totalCost = cartList.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
          )

          return (
            <div className="cart-summary-container">
              <h1 className="order-total-label">
                Order Total:{' '}
                <span className="order-total-value">
                  Rs {totalCost.toFixed(2)}/-
                </span>
              </h1>
              <p className="total-items">{totalItems} Items in cart</p>
              {error && <p className="checkout-error">*{error}</p>}
              <button
                type="button"
                className="checkout-btn"
                onClick={() => this.handleCheckout(cartList, removeAllCartItems)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default CartSummary