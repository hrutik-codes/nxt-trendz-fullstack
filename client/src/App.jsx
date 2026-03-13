import {Component} from 'react'
import {Route, Switch, Redirect, BrowserRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'
import CartContext from './context/CartContext'
import {apiCall} from './utils/api'
import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  componentDidMount() {
    this.fetchCart()
  }

  // Fetch cart from backend on app load
  fetchCart = async () => {
    try {
      const token = Cookies.get('jwt_token')
      if (!token) return
      const data = await apiCall('/api/cart')
      const formattedCart = data.items.map(item => ({
        id: item.productId,
        title: item.title,
        price: item.price,
        imageUrl: item.image,
        brand: 'NxtTrendz',
        quantity: item.quantity,
      }))
      this.setState({cartList: formattedCart})
    } catch (err) {
      console.error('Failed to fetch cart:', err.message)
    }
  }

  // Remove all cart items
  removeAllCartItems = async () => {
    try {
      await apiCall('/api/cart/clear', {method: 'DELETE'})
      this.setState({cartList: []})
    } catch (err) {
      console.error('Failed to clear cart:', err.message)
    }
  }

  // Remove a single cart item by id
  removeCartItem = async id => {
    try {
      await apiCall(`/api/cart/${id}`, {method: 'DELETE'})
      this.setState(prevState => ({
        cartList: prevState.cartList.filter(item => item.id !== id),
      }))
    } catch (err) {
      console.error('Failed to remove cart item:', err.message)
    }
  }

  // Increment quantity of a cart item by id
  incrementCartItemQuantity = async id => {
    try {
      const {cartList} = this.state
      const item = cartList.find(i => i.id === id)
      const newQuantity = item.quantity + 1
      await apiCall(`/api/cart/${id}`, {
        method: 'PUT',
        body: JSON.stringify({quantity: newQuantity}),
      })
      this.setState(prevState => ({
        cartList: prevState.cartList.map(i =>
          i.id === id ? {...i, quantity: newQuantity} : i,
        ),
      }))
    } catch (err) {
      console.error('Failed to increment quantity:', err.message)
    }
  }

  // Decrement quantity — remove if quantity reaches 0
  decrementCartItemQuantity = async id => {
    try {
      const {cartList} = this.state
      const item = cartList.find(i => i.id === id)
      if (item.quantity === 1) {
        await apiCall(`/api/cart/${id}`, {method: 'DELETE'})
        this.setState(prevState => ({
          cartList: prevState.cartList.filter(i => i.id !== id),
        }))
      } else {
        const newQuantity = item.quantity - 1
        await apiCall(`/api/cart/${id}`, {
          method: 'PUT',
          body: JSON.stringify({quantity: newQuantity}),
        })
        this.setState(prevState => ({
          cartList: prevState.cartList.map(i =>
            i.id === id ? {...i, quantity: newQuantity} : i,
          ),
        }))
      }
    } catch (err) {
      console.error('Failed to decrement quantity:', err.message)
    }
  }

  // Add item to cart
  addCartItem = async product => {
    try {
      const {cartList} = this.state
      const {id, quantity = 1} = product
      const existingItem = cartList.find(item => item.id === id)

      if (existingItem) {
        const newQuantity = existingItem.quantity + Number(quantity)
        await apiCall(`/api/cart/${id}`, {
          method: 'PUT',
          body: JSON.stringify({quantity: newQuantity}),
        })
        this.setState(prevState => ({
          cartList: prevState.cartList.map(item =>
            item.id === id
              ? {...item, quantity: newQuantity}
              : item,
          ),
        }))
      } else {
        await apiCall('/api/cart', {
          method: 'POST',
          body: JSON.stringify({
            productId: String(id),
            title: product.title,
            price: product.price,
            image: product.imageUrl,
            quantity: Number(quantity),
          }),
        })
        const newItem = {...product, quantity: Number(quantity)}
        this.setState(prevState => ({
          cartList: [...prevState.cartList, newItem],
        }))
      }
    } catch (err) {
      console.error('Failed to add to cart:', err.message)
    }
  }

  render() {
    const {cartList} = this.state
    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={LoginForm} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/products" component={Products} />
            <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="not-found" />
          </Switch>
        </BrowserRouter>
      </CartContext.Provider>
    )
  }
}

export default App
