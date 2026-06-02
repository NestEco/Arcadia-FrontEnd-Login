import { useState } from 'react'
import Register from './Register'

function App() {
  const [showRegister, setShowRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:8083/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || 'Credenciales inválidas')
      }

      // Successful login
      const data = await response.json()
      setSuccess(true)
      
      // Guardar token y datos del usuario
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol
      }))
      
      // Redirigir según el rol
      setTimeout(() => {
        if (data.rol === 'Admin') {
          window.location.href = 'http://localhost:5174'
        } else {
          window.location.href = 'http://localhost:3000'
        }
      }, 1000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBypass = () => {
    setSuccess(true)
    setTimeout(() => {
      alert("¡Bypass Exitoso! (Modo Presentación: Accediendo sin credenciales reales)")
    }, 500)
  }

  if (showRegister) {
    return <Register />
  }

  if (success) {
    return (
      <div className="login-container">
        <div className="glass-card success-message">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2>Bienvenido al Panel Admin</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            Conectando al dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <button 
        onClick={() => window.history.back()}
        className="back-button"
        title="Volver atrás"
      >
        ← Volver
      </button>
      <div className="glass-card">
        <div className="login-header">
          <h1>Arcadia Admin</h1>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@arcadia.com"
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
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="loader"></span> : 'Iniciar Sesión'}
          </button>
        </form>

        <button 
          onClick={handleBypass} 
          className="btn-secondary"
          title="Usa este botón en tu presentación si no tienes usuarios en la DB"
        >
          Bypass Login (Modo Presentación)
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? 
          </span>
          <button 
            onClick={() => setShowRegister(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#818cf8', 
              cursor: 'pointer',
              marginLeft: '0.5rem'
            }}
          >
            Regístrate
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
