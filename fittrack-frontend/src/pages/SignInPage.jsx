import { NavLink } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'

function SignInPage() {
  return (
    <AuthLayout>
      <form className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>
        <button type="submit" className="auth-button">
          Sign in
        </button>
        <p className="auth-switch-text">
          Don&apos;t have an account? <NavLink to="/signup">Create one</NavLink>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignInPage

