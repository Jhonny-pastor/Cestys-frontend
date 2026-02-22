import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { fetchCategories, fetchCourses } from '../services/catalogApi'

const fallbackCategories = [
  { id: 1, nombre: 'Art & Design' },
  { id: 2, nombre: 'Development' },
  { id: 3, nombre: 'Communication' },
  { id: 4, nombre: 'Videography' },
  { id: 5, nombre: 'Photography' },
  { id: 6, nombre: 'Marketing' },
  { id: 7, nombre: 'Finance' },
  { id: 8, nombre: 'Science' },
]

const fallbackCourses = [
  { id: 1, nombre: 'Create an LMS Website with LearnPress', precio: 49, estado: 'PUBLISHED' },
  { id: 2, nombre: 'Design a Website with ThimPress', precio: 39, estado: 'PUBLISHED' },
  { id: 3, nombre: 'Learn React from Zero', precio: 29, estado: 'PUBLISHED' },
  { id: 4, nombre: 'Master Node.js APIs', precio: 59, estado: 'PUBLISHED' },
  { id: 5, nombre: 'UI Design Fundamentals', precio: 35, estado: 'PUBLISHED' },
  { id: 6, nombre: 'Marketing for Digital Products', precio: 25, estado: 'PUBLISHED' },
]

function HomePage() {
  const [categories, setCategories] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null')
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [categoriesData, coursesData] = await Promise.all([
        fetchCategories(),
        fetchCourses(),
      ])

      setCategories(categoriesData.length > 0 ? categoriesData : fallbackCategories)
      setCourses(coursesData.length > 0 ? coursesData : fallbackCourses)
      setLoading(false)
    }

    loadData()
  }, [])

  return (
    <div className="page">
      <SiteHeader user={user} />

      <section className="hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <h1>Desarrolla Habilidades Con Cursos Online</h1>
            <p>
              Aprende con rutas practicas, docentes expertos y una plataforma moderna para
              crecer profesionalmente.
            </p>
            {!user && (
              <Link to="/auth" className="cta-primary">
                Ir a Login / Register
              </Link>
            )}
          </div>
          <div className="hero-visual">
            <div className="hero-badge">ONLINE</div>
          </div>
        </div>
      </section>

      <main className="container home-main">
        <section className="section-head">
          <div>
            <h2>Top Categories</h2>
            <p>Explora nuestras categorias mas populares.</p>
          </div>
        </section>

        <section className="category-grid">
          {categories.slice(0, 8).map((category) => (
            <article key={category.id} className="category-card">
              <h3>{category.nombre}</h3>
              <span>38 Courses</span>
            </article>
          ))}
        </section>

        <section className="section-head" id="cursos">
          <div>
            <h2>Cursos Destacados</h2>
            <p>Explora nuestros cursos con mayor demanda.</p>
          </div>
        </section>

        <section className="course-grid">
          {courses.slice(0, 6).map((course) => (
            <article key={course.id} className="course-card">
              <div className="course-image" />
              <div className="course-body">
                <p className="course-meta">by CESTYS</p>
                <h3>{course.nombre}</h3>
                <div className="course-row">
                  <span>2 Weeks</span>
                  <span>156 Students</span>
                </div>
                <div className="course-row price-row">
                  <strong>${Number(course.precio ?? 0).toFixed(2)}</strong>
                  <button type="button">View More</button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="stats-grid">
          <article>
            <strong>25K+</strong>
            <span>Active Students</span>
          </article>
          <article>
            <strong>899</strong>
            <span>Total Courses</span>
          </article>
          <article>
            <strong>158</strong>
            <span>Instructor</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>Satisfaction Rate</span>
          </article>
        </section>

        {loading && <p className="loading-note">Cargando catalogo...</p>}
      </main>

      <SiteFooter />
    </div>
  )
}

export default HomePage

