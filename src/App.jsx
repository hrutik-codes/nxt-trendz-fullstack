import {Component} from 'react'
import {Route, Switch, Redirect, BrowserRouter} from 'react-router-dom'

import LoginForm from './components/LoginForm'
/*import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'*/
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  // Remove all cart items
  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  // Remove a single cart item by id
  removeCartItem = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(item => item.id !== id),
    }))
  }

  // Increment quantity of a cart item by id
  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(item =>
        item.id === id ? {...item, quantity: item.quantity + 1} : item,
      ),
    }))
  }

  // Decrement quantity of a cart item by id;
  // if quantity becomes 0 (i.e., was 1) remove the item
  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedList = prevState.cartList
        .map(item =>
          item.id === id ? {...item, quantity: item.quantity - 1} : item,
        )
        .filter(item => item.quantity > 0) // removes items with 0 quantity
      return {cartList: updatedList}
    })
  }

  // Add a cart item.
  // If the item already exists (by id), increase its quantity.
  // Accepts product object which may include a quantity property.
  addCartItem = product => {
    this.setState(prevState => {
      const {cartList} = prevState
      const {id, quantity = 1} = product

      const existingItem = cartList.find(item => item.id === id)

      if (existingItem) {
        // increase quantity of the existing item (do not add duplicate entry)
        const updatedList = cartList.map(item =>
          item.id === id
            ? {...item, quantity: item.quantity + Number(quantity)}
            : item,
        )
        return {cartList: updatedList}
      }

      // New item: ensure it has quantity property
      const newItem = {...product, quantity: Number(quantity)}
      return {cartList: [...cartList, newItem]}
    })
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
            {/* <ProtectedRoute exact path="/" component={Home} /> */}
            {/* <ProtectedRoute exact path="/products" component={Products} /> */}
            {/* <ProtectedRoute
              exact
              path="/products/:id"
              component={ProductItemDetails}
            /> */}
            {/* <ProtectedRoute exact path="/cart" component={Cart} /> */}
            {/* <Route path="/not-found" component={NotFound} /> */}
            {/* <Redirect to="not-found" /> */}
          </Switch>
        </BrowserRouter>
      </CartContext.Provider>
    )
  }
}

export default App
