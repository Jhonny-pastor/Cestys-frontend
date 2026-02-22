import { useState } from 'react'
import { loginUser, registerUser } from './services/authApi'
import logo from './assets/logo.png'

function App() {
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loginStatus, setLoginStatus] = useState({ type: '', message: '' })
  const [registerStatus, setRegisterStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState({ login: false, register: false })

  const onLoginChange = (event) => {
    setLoginData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const onRegisterChange = (event) => {
    setRegisterData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginStatus({ type: '', message: '' })
    setLoading((prev) => ({ ...prev, login: true }))

    try {
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
      })

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))

      setLoginStatus({ type: 'success', message: 'Inicio de sesión exitoso.' })
      setLoginData({ email: '', password: '' })
    } catch (error) {
      setLoginStatus({ type: 'error', message: error.message })
    } finally {
      setLoading((prev) => ({ ...prev, login: false }))
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()
    setRegisterStatus({ type: '', message: '' })

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterStatus({ type: 'error', message: 'Las contraseñas no coinciden.' })
      return
    }

    setLoading((prev) => ({ ...prev, register: true }))

    try {
      const response = await registerUser({
        email: registerData.email,
        password: registerData.password,
      })

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('auth_user', JSON.stringify(response.user))

      setRegisterStatus({ type: 'success', message: 'Registro exitoso.' })
      setRegisterData({ email: '', password: '', confirmPassword: '' })
    } catch (error) {
      setRegisterStatus({ type: 'error', message: error.message })
    } finally {
      setLoading((prev) => ({ ...prev, register: false }))
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="brand">
            <img src={logo} alt="INCITESA" className="brand-logo" />
          </div>
          <nav className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#cursos">Cursos</a>
            <a href="#blog">Blog</a>
            <a href="#auth" className="active-link">
              Login / Register
            </a>
          </nav>
        </div>
      </header>

      <main className="container auth-section">
        <div className="auth-grid">
          <section className="auth-card" id="auth">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Email o usuario*"
                value={loginData.email}
                onChange={onLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password*"
                value={loginData.password}
                onChange={onLoginChange}
                required
              />
              {loginStatus.message && (
                <p className={`status ${loginStatus.type}`}>{loginStatus.message}</p>
              )}
              <button type="submit" disabled={loading.login}>
                {loading.login ? 'Ingresando...' : 'Login'}
              </button>
            </form>
          </section>

          <section className="auth-card">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                value={registerData.email}
                onChange={onRegisterChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password*"
                value={registerData.password}
                onChange={onRegisterChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password*"
                value={registerData.confirmPassword}
                onChange={onRegisterChange}
                required
              />
              {registerStatus.message && (
                <p className={`status ${registerStatus.type}`}>{registerStatus.message}</p>
              )}
              <button type="submit" disabled={loading.register}>
                {loading.register ? 'Registrando...' : 'Register'}
              </button>
            </form>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h3>JPastorPress</h3>
            <p>Plataforma de aprendizaje online para impulsar tus habilidades.</p>
          </div>
          <div>
            <h4>Get Help</h4>
            <p>Contact Us</p>
            <p>FAQ</p>
          </div>
          <div>
            <h4>Programs</h4>
            <p>Business</p>
            <p>IT & Software</p>
          </div>
          <div>
            <h4>Contact Us</h4>
            <p>supportlms@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
