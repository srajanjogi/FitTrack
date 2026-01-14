import '../App.css'

function AuthLayout({ children }) {
  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">FitTrack</span>
          <p className="auth-subtitle">Sign in to manage your gym members, attendance, and billing.</p>
        </div>
        {children}
        <p className="auth-footer-text">Tip: later this will connect to the Spring Boot backend with real auth.</p>
      </div>
    </div>
  )
}

export default AuthLayout

