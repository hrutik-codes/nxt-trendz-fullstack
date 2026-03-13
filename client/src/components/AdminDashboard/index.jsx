import {Component} from 'react'
import {apiCall} from '../../utils/api'
import Header from '../Header'
import './index.css'

class AdminDashboard extends Component {
  state = {
    activeTab: 'orders',
    orders: [],
    products: [],
    users: [],
    isLoading: false,
    showAddProduct: false,
    newProduct: {
      title: '',
      price: '',
      description: '',
      image: '',
      category: '',
      stock: '',
    },
    editingProduct: null,
  }

  componentDidMount() {
    this.fetchOrders()
  }

  // ── FETCH DATA ──────────────────────────────

  fetchOrders = async () => {
    this.setState({isLoading: true})
    try {
      const data = await apiCall('/api/admin/orders')
      this.setState({orders: data})
    } catch (err) {
      console.error(err.message)
    } finally {
      this.setState({isLoading: false})
    }
  }

  fetchProducts = async () => {
    this.setState({isLoading: true})
    try {
      const data = await apiCall('/api/admin/products')
      this.setState({products: data})
    } catch (err) {
      console.error(err.message)
    } finally {
      this.setState({isLoading: false})
    }
  }

  fetchUsers = async () => {
    this.setState({isLoading: true})
    try {
      const data = await apiCall('/api/admin/users')
      this.setState({users: data})
    } catch (err) {
      console.error(err.message)
    } finally {
      this.setState({isLoading: false})
    }
  }

  // ── TAB SWITCHING ────────────────────────────

  switchTab = tab => {
    this.setState({activeTab: tab})
    if (tab === 'orders') this.fetchOrders()
    if (tab === 'products') this.fetchProducts()
    if (tab === 'users') this.fetchUsers()
  }

  // ── ORDERS ───────────────────────────────────

  updateOrderStatus = async (orderId, status) => {
    try {
      await apiCall(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({orderStatus: status}),
      })
      this.fetchOrders()
    } catch (err) {
      console.error(err.message)
    }
  }

  // ── PRODUCTS ─────────────────────────────────

  onChangeNewProduct = e => {
    this.setState(prevState => ({
      newProduct: {...prevState.newProduct, [e.target.name]: e.target.value},
    }))
  }

  addProduct = async () => {
    const {newProduct} = this.state
    try {
      await apiCall('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      })
      this.setState({
        showAddProduct: false,
        newProduct: {title: '', price: '', description: '', image: '', category: '', stock: ''},
      })
      this.fetchProducts()
    } catch (err) {
      console.error(err.message)
    }
  }

  deleteProduct = async productId => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await apiCall(`/api/admin/products/${productId}`, {method: 'DELETE'})
      this.fetchProducts()
    } catch (err) {
      console.error(err.message)
    }
  }

  // ── USERS ────────────────────────────────────

  deleteUser = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await apiCall(`/api/admin/users/${userId}`, {method: 'DELETE'})
      this.fetchUsers()
    } catch (err) {
      console.error(err.message)
    }
  }

  // ── RENDER ORDERS ────────────────────────────

  renderOrders = () => {
    const {orders} = this.state
    if (orders.length === 0) return <p className="admin-empty">No orders yet.</p>
    return (
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-id">#{order._id.slice(-6)}</td>
                <td>{order.userId?.name || 'N/A'}</td>
                <td>Rs {order.totalAmount?.toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.paymentInfo?.status}`}>
                    {order.paymentInfo?.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${order.orderStatus}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={order.orderStatus}
                    onChange={e => this.updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // ── RENDER PRODUCTS ──────────────────────────

  renderProducts = () => {
    const {products, showAddProduct, newProduct} = this.state
    return (
      <div>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => this.setState({showAddProduct: !showAddProduct})}
        >
          {showAddProduct ? 'Cancel' : '+ Add Product'}
        </button>

        {showAddProduct && (
          <div className="add-product-form">
            <h3 className="form-title">Add New Product</h3>
            <div className="form-grid">
              {['title', 'price', 'image', 'category', 'stock'].map(field => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={newProduct[field]}
                  onChange={this.onChangeNewProduct}
                  className="admin-input"
                  type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                />
              ))}
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={this.onChangeNewProduct}
                className="admin-input admin-textarea"
              />
            </div>
            <button type="button" className="admin-save-btn" onClick={this.addProduct}>
              Save Product
            </button>
          </div>
        )}

        {products.length === 0 ? (
          <p className="admin-empty">No products added yet.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.title}
                        className="admin-product-img"
                      />
                    </td>
                    <td className="product-title-cell">{product.title}</td>
                    <td>Rs {product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-delete-btn"
                        onClick={() => this.deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  // ── RENDER USERS ─────────────────────────────

  renderUsers = () => {
    const {users} = this.state
    if (users.length === 0) return <p className="admin-empty">No users found.</p>
    return (
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.isAdmin ? 'paid' : 'processing'}`}>
                    {user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {!user.isAdmin && (
                    <button
                      type="button"
                      className="admin-delete-btn"
                      onClick={() => this.deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const {activeTab, isLoading} = this.state
    return (
      <>
        <Header />
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <div className="admin-tabs">
            {['orders', 'products', 'users'].map(tab => (
              <button
                key={tab}
                type="button"
                className={`admin-tab ${activeTab === tab ? 'active-tab' : ''}`}
                onClick={() => this.switchTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="admin-loading">Loading...</div>
          ) : (
            <div className="admin-content">
              {activeTab === 'orders' && this.renderOrders()}
              {activeTab === 'products' && this.renderProducts()}
              {activeTab === 'users' && this.renderUsers()}
            </div>
          )}
        </div>
      </>
    )
  }
}

export default AdminDashboard