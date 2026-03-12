import Cookies from 'js-cookie'

const BASE_URL = 'http://localhost:5000'

export const getToken = () => {
  return Cookies.get('jwt_token')
}

export const setToken = token => {
  Cookies.set('jwt_token', token, { expires: 7 })
}

export const removeToken = () => {
  Cookies.remove('jwt_token')
}

export const apiCall = async (endpoint, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export default BASE_URL
