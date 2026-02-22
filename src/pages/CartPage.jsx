import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import {
  clearCart,
  createOrder,
  fetchCart,
  fetchMyOrders,
  removeCourseFromCart,
  simulatePayment,
} from '../services/orderApi'

function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState({ cart: true, checkout: false })

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null')
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }

    const loadData = async () => {
      try {
        const [cartData, ordersData] = await Promise.all([fetchCart(), fetchMyOrders()])
        setCart(cartData)
        setOrders(ordersData)
      } catch (error) {
        setStatus({ type: 'error', message: error.message })
      } finally {
        setLoading((prev) => ({ ...prev, cart: false }))
      }
    }

    loadData()
  }, [navigate, user])

  const handleRemove = async (cursoId) => {
    try {
      const nextCart = await removeCourseFromCart(cursoId)
      setCart(nextCart)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  const handleClear = async () => {
    await clearCart()
    setCart({ items: [], total: 0 })
  }

  const handleCheckout = async () => {
    setLoading((prev) => ({ ...prev, checkout: true }))
    setStatus({ type: '', message: '' })

    try {
      const orderResponse = await createOrder()
      const orderId = orderResponse?.data?.id
      const paymentId = `SIM-PAY-${Date.now()}`

      await simulatePayment({ orderId, paymentId })

      const [cartData, ordersData] = await Promise.all([fetchCart(), fetchMyOrders()])
      setCart(cartData)
      setOrders(ordersData)
      setStatus({ type: 'success', message: 'Pago simulado y matricula generada.' })
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading((prev) => ({ ...prev, checkout: false }))
    }
  }

  return (
    <div className="page">
      <SiteHeader user={user} />
      <main className="container cart-page">
        <div className="section-head">
          <div>
            <h2>Tu Carrito</h2>
            <p>Revisa los cursos seleccionados antes de pagar.</p>
          </div>
          <Link to="/" className="cta-secondary">
            Seguir comprando
          </Link>
        </div>

        {status.message && <p className={`status ${status.type}`}>{status.message}</p>}

        {loading.cart ? (
          <p className="loading-note">Cargando carrito...</p>
        ) : (
          <>
            <section className="cart-list">
              {cart.items.length === 0 && <p>Tu carrito esta vacio.</p>}
              {cart.items.map((item) => (
                <article key={item.cursoId} className="cart-item">
                  <div>
                    <h3>{item.nombre}</h3>
                    <p>${Number(item.precio ?? 0).toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => handleRemove(item.cursoId)}>
                    Quitar
                  </button>
                </article>
              ))}
            </section>

            <section className="cart-summary">
              <strong>Total: ${Number(cart.total ?? 0).toFixed(2)}</strong>
              <div className="cart-actions">
                <button type="button" className="cta-secondary" onClick={handleClear}>
                  Vaciar carrito
                </button>
                <button
                  type="button"
                  className="cta-primary"
                  disabled={loading.checkout || cart.items.length === 0}
                  onClick={handleCheckout}
                >
                  {loading.checkout ? 'Procesando...' : 'Pagar (simulado)'}
                </button>
              </div>
            </section>

            <section className="orders-block">
              <h3>Mis Ordenes</h3>
              {orders.length === 0 && <p>Aun no tienes ordenes.</p>}
              {orders.map((order) => (
                <article key={order.id} className="order-item">
                  <span>Orden #{order.id}</span>
                  <span>{order.estado}</span>
                  <span>${Number(order.monto ?? 0).toFixed(2)}</span>
                </article>
              ))}
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

export default CartPage

