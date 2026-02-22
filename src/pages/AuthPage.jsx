import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { loginUser, registerUser } from '../services/authApi'

function AuthPage() {
  const navigate = useNavigate()
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

  const saveSession = (response) => {
    localStorage.setItem('access_token', response.access_token)
    localStorage.setItem('auth_user', JSON.stringify(response.user))
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
      saveSession(response)
      navigate('/')
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
      setRegisterStatus({ type: 'error', message: 'Las contrasenas no coinciden.' })
      return
    }

    setLoading((prev) => ({ ...prev, register: true }))
    try {
      const response = await registerUser({
        email: registerData.email,
        password: registerData.password,
      })
      saveSession(response)
      navigate('/')
    } catch (error) {
      setRegisterStatus({ type: 'error', message: error.message })
    } finally {
      setLoading((prev) => ({ ...prev, register: false }))
    }
  }

  return (
    <div className="page">
      <SiteHeader user={null} />
      <main className="container auth-section">
        <div className="auth-grid">
          <section className="auth-card">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <input
                type="email"
                name="email"
                placeholder="Email*"
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
      <SiteFooter />
    </div>
  )
}

export default AuthPage

