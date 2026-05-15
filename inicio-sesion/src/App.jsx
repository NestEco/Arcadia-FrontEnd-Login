import { useState } from 'react'
import './App.css'

function App() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const API_URL = 'http://localhost:8080/api/usuarios'

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setNombre('')
    setError(null)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Credenciales inválidas')
      }

      const data = await response.json()

      // Preparar datos de autenticación para pasar vía URL
      const authPayload = encodeURIComponent(JSON.stringify({
        token: data.token,
        userId: data.userId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }))

      // También guardar localmente
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }))

      setSuccessMessage(`¡Bienvenido, ${data.nombre}!`)
      setSuccess(true)

      // Redirigir según el rol, pasando auth vía hash
      setTimeout(() => {
        if (data.rol === 'Admin') {
          window.location.href = `http://localhost:5174#auth=${authPayload}`
        } else {
          window.location.href = `http://localhost:3000#auth=${authPayload}`
        }
      }, 1500)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          nombre,
          email,
          password,
          rol: 'Admin'
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al registrar usuario')
      }

      // Registro exitoso → auto-login
      setSuccessMessage('¡Cuenta creada! Iniciando sesión...')
      setSuccess(true)

      // Hacer login automático
      setTimeout(async () => {
        try {
          const loginResp = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })

          if (loginResp.ok) {
            const data = await loginResp.json()
            const authPayload = encodeURIComponent(JSON.stringify({
              token: data.token,
              userId: data.userId,
              nombre: data.nombre,
              email: data.email,
              rol: data.rol
            }))
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify({
              id: data.userId,
              nombre: data.nombre,
              email: data.email,
              rol: data.rol
            }))
            window.location.href = `http://localhost:5174#auth=${authPayload}`
          }
        } catch {
          window.location.href = 'http://localhost:5174'
        }
      }, 1500)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-container">
        <div className="glass-card success-card">
          <div className="success-icon">✓</div>
          <h2>{successMessage}</h2>
          <p className="success-sub">Redirigiendo al panel de administración...</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="glass-card">
        <div className="login-header">
          <div className="logo-icon">◆</div>
          <h1>Arcadia</h1>
          <p>{isRegister ? 'Crea tu cuenta para continuar' : 'Ingresa tus credenciales para continuar'}</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); resetForm() }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); resetForm() }}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠</span>
            {error}
          </div>
        )}

        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                className="form-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@arcadia.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
            {isRegister && (
              <span className="field-hint">Mínimo 6 caracteres</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loader"></span> : (isRegister ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="divider">
          <span>o</span>
        </div>

        <p className="switch-text">
          {isRegister
            ? '¿Ya tienes cuenta? '
            : '¿No tienes cuenta? '}
          <button
            className="link-button"
            onClick={() => { setIsRegister(!isRegister); resetForm() }}
          >
            {isRegister ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
