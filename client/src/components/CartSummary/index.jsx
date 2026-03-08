import CartContext from '../../context/CartContext'
import './index.css'

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value

      const totalItems = cartList.length

      const totalCost = cartList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      )

      return (
        <div className="cart-summary-container">
          <h1 className="order-total-label">
            Order Total:{' '}
            <span className="order-total-value">Rs {totalCost}/-</span>
          </h1>
          <p className="total-items">{totalItems} Items in cart</p>
          <button type="button" className="checkout-btn">
            Checkout
          </button>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
