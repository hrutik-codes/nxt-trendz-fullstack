import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {setToken} from '../../utils/api'
import './index.css'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeName = event => this.setState({name: event.target.value})
  onChangeEmail = event => this.setState({email: event.target.value})
  onChangePassword = event => this.setState({password: event.target.value})

  onSubmitSuccess = token => {
    const {history} = this.props
    setToken(token)
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {name, email, password} = this.state
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
      })
      const data = await response.json()
      if (response.ok) {
        this.onSubmitSuccess(data.token)
      } else {
        this.onSubmitFailure(data.message)
      }
    } catch (err) {
      this.onSubmitFailure(err.message || 'Something went wrong. Please try again.')
    }
  }

  render() {
    const {name, email, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-mobile-img"
          alt="website logo"
        />
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
          className="login-img"
          alt="website login"
        />
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
            className="login-website-logo-desktop-img"
            alt="website logo"
          />
          <div className="input-container">
            <label className="input-label" htmlFor="name">NAME</label>
            <input
              type="text"
              id="name"
              className="username-input-field"
              value={name}
              onChange={this.onChangeName}
              placeholder="Full Name"
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              className="username-input-field"
              value={email}
              onChange={this.onChangeEmail}
              placeholder="Email"
            />
          </div>
          <div className="input-container">
            <label className="input-label" htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              value={password}
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>
          <button type="submit" className="login-button">
            Register
          </button>
          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          <p className="register-link-text">
            Already have an account?{' '}
            <Link to="/login" className="register-link">Login</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default Register