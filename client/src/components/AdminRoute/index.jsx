/* eslint-disable react-hooks/error-boundaries */
import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'

const AdminRoute = props => {
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    return <Redirect to="/login" />
  }

  // Decode JWT to check isAdmin
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.isAdmin) {
      return <Redirect to="/" />
    }
  } catch (err) {
    console.error(err.message || 'Invalid token')
    return <Redirect to="/login" />
  }

  return <Route {...props} />
}

export default AdminRoute
