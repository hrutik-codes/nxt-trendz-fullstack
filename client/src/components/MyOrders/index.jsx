import {Component} from 'react'
import Header from '../Header'
import {apiCall} from '../../utils/api'
import './index.css'

const statusColors = {
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
}

class MyOrders extends Component {
  state = {
    orders: [],
    isLoading: true,
    error: '',
  }

  componentDidMount() {
    this.fetchOrders()
  }

  fetchOrders = async () => {
    try {
      const data = await apiCall('/api/orders/my')
      this.setState({orders: data, isLoading: false})
    } catch (err) {
      this.setState({error: err.message, isLoading: false})
    }
  }

  renderOrderItems = items => (
    <ul className="order-items-list">
      {items.map(item => (
        <li key={item.productId} className="order-item">
          <img
            src={item.image}
            alt={item.title}
            className="order-item-img"
          />
          <div className="order-item-info">
            <p className="order-item-title">{item.title}</p>
            <p className="order-item-meta">
              Qty: {item.quantity} × Rs {item.price} ={' '}
              <strong>Rs {(item.quantity * item.price).toFixed(2)}</strong>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )

  renderOrders = () => {
    const {orders} = this.state
    if (orders.length === 0) {
      return (
        <div className="no-orders-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
            alt="no orders"
            className="no-orders-img"
          />
          <h2 className="no-orders-heading">No Orders Yet!</h2>
          <p className="no-orders-desc">
            Looks like you haven't placed any orders yet.
          </p>
        </div>
      )
    }

    return (
      <div className="orders-list">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div>
                <p className="order-id">
                  Order ID: <span>#{order._id.slice(-8).toUpperCase()}</span>
                </p>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="order-badges">
                <span
                  className={`order-status-badge ${
                    statusColors[order.orderStatus] || ''
                  }`}
                >
                  {order.orderStatus}
                </span>
                <span
                  className={`order-payment-badge ${
                    order.paymentInfo?.status === 'paid'
                      ? 'payment-paid'
                      : 'payment-pending'
                  }`}
                >
                  {order.paymentInfo?.status}
                </span>
              </div>
            </div>
            {this.renderOrderItems(order.items)}
            <div className="order-card-footer">
              <p className="order-total">
                Total: <strong>Rs {order.totalAmount?.toFixed(2)}/-</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  render() {
    const {isLoading, error} = this.state
    return (
      <>
        <Header />
        <div className="my-orders-container">
          <h1 className="my-orders-heading">My Orders</h1>
          {isLoading && <p className="orders-loading">Loading your orders...</p>}
          {error && <p className="orders-error">{error}</p>}
          {!isLoading && !error && this.renderOrders()}
        </div>
      </>
    )
  }
}

export default MyOrders
