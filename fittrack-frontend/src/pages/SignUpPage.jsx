import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'

function SignUpPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function isStrongPassword(value) {
    // At least 6 chars, one lowercase, one uppercase, one number, one special character
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (!isStrongPassword(password)) {
      setError(
        'Use a stronger password with at least 6 characters, including uppercase, lowercase, number, and special character.'
      )
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Signup failed')
      }

      const data = await res.json()
      // Store basic user info; later we can add JWT here
      window.localStorage.setItem('fittrackUser', JSON.stringify(data))
      // After creating an account, send the user to the Sign in page
      navigate('/signin')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Alex Johnson"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="auth-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="auth-error-text">{error}</p>}
        <button type="submit" className="auth-button">
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <p className="auth-switch-text">
          Already have an account? <NavLink to="/signin">Sign in</NavLink>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignUpPage

