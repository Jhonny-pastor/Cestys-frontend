import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

function SiteHeader({ user }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    navigate('/')
  }

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <img src={logo} alt="INCITESA" className="brand-logo" />
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Inicio
          </NavLink>
          <a href="#cursos">Cursos</a>
          <a href="#blog">Blog</a>
          {!user && (
            <NavLink to="/auth" className={({ isActive }) => (isActive ? 'active' : '')}>
              Login / Register
            </NavLink>
          )}
          {user && (
            <button type="button" className="nav-button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
