import { NavLink } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

function SignUpPage() {
  return (
    <AuthLayout>
      <form className="auth-form">
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" placeholder="Alex Johnson" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input id="signup-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input id="signup-password" type="password" placeholder="Create a strong password" />
        </div>
        <button type="submit" className="auth-button">
          Sign up
        </button>
        <p className="auth-switch-text">
          Already have an account? <NavLink to="/signin">Sign in</NavLink>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignUpPage

