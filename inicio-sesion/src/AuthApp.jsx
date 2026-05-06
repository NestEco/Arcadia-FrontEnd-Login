import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f4f0;
    font-family: 'DM Sans', sans-serif;
  }

  .auth-card {
    width: 460px;
    background: #ffffff;
    border-radius: 20px;
    border: 0.5px solid rgba(0,0,0,0.1);
    padding: 3rem 2.5rem;
    box-shadow: 0 4px 40px rgba(0,0,0,0.06);
  }

  .auth-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 2.5rem;
  }

  .brand-icon {
    width: 36px;
    height: 36px;
    background: #1a1a2e;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
  }

  .tab-bar {
    display: flex;
    background: #f5f4f0;
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 2rem;
  }

  .tab {
    flex: 1;
    padding: 9px;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #888780;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.22s ease;
  }

  .tab.active {
    background: #ffffff;
    color: #1a1a2e;
    font-weight: 500;
    border: 0.5px solid rgba(0,0,0,0.12);
  }

  .auth-heading {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
    line-height: 1.2;
  }

  .auth-subheading {
    font-size: 14px;
    color: #888780;
    margin-bottom: 2rem;
    font-weight: 300;
  }

  .form-group { margin-bottom: 1.1rem; }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #888780;
    margin-bottom: 6px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .form-input {
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border: 0.5px solid rgba(0,0,0,0.18);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1a2e;
    background: #ffffff;
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
  }

  .form-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .btn-primary {
    width: 100%;
    height: 46px;
    background: #1a1a2e;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 1.25rem;
    transition: background 0.18s ease, transform 0.1s ease;
    letter-spacing: 0.1px;
  }

  .btn-primary:hover { background: #2d2d4e; }
  .btn-primary:active { transform: scale(0.99); }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 1.4rem 0;
    color: #b4b2a9;
    font-size: 12px;
  }

  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 0.5px;
    background: rgba(0,0,0,0.1);
  }

  .social-row { display: flex; gap: 10px; }

  .btn-social {
    flex: 1;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 0.5px solid rgba(0,0,0,0.14);
    border-radius: 8px;
    background: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #1a1a2e;
    cursor: pointer;
    transition: background 0.15s;
  }

  .btn-social:hover { background: #f5f4f0; }

  .forgot-link {
    font-size: 12px;
    color: #4f46e5;
    text-decoration: none;
    text-align: right;
    display: block;
    margin-top: 6px;
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
  }

  .terms-text {
    font-size: 12px;
    color: #b4b2a9;
    text-align: center;
    margin-top: 1.2rem;
    line-height: 1.6;
  }

  .terms-text a { color: #4f46e5; text-decoration: none; cursor: pointer; }

  .strength-bar { display: flex; gap: 4px; margin-top: 6px; }

  .strength-seg {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: rgba(0,0,0,0.1);
    transition: background 0.2s;
  }

  .strength-seg.weak   { background: #e24b4a; }
  .strength-seg.medium { background: #ef9f27; }
  .strength-seg.strong { background: #1d9e75; }
`;

function getPasswordStrength(val) {
  let level = 0;
  if (val.length >= 4) level = 1;
  if (val.length >= 8) level = 2;
  if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) level = 3;
  if (val.length >= 10 && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val)) level = 4;
  return level;
}

function StrengthBar({ password }) {
  const level = getPasswordStrength(password);
  const cls = ["", "weak", "medium", "strong", "strong"];
  return (
    <div className="strength-bar">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`strength-seg${i < level ? ` ${cls[level]}` : ""}`}
        />
      ))}
    </div>
  );
}

function BrandIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
      <circle cx="9" cy="9" r="2.5" fill="white" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1a1a2e">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LoginPage({ onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Iniciando sesión con: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="auth-heading">Bienvenido de vuelta</h1>
      <p className="auth-subheading">Ingresa tus credenciales para continuar</p>

      <div className="form-group">
        <label className="form-label">Correo electrónico</label>
        <input
          className="form-input"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Contraseña</label>
        <input
          className="form-input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="button" className="forgot-link">¿Olvidaste tu contraseña?</button>
      </div>

      <button type="submit" className="btn-primary">Iniciar sesión</button>

      <div className="divider">o continúa con</div>

      <div className="social-row">
        <button type="button" className="btn-social"><GoogleIcon /> Google</button>
        <button type="button" className="btn-social"><GitHubIcon /> GitHub</button>
      </div>

      <p className="terms-text">
        Al iniciar sesión, aceptas nuestros <a href="#">Términos de servicio</a>
      </p>
    </form>
  );
}

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert(`Cuenta creada para: ${firstName} ${lastName} (${email})`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="auth-heading">Crea tu cuenta</h1>
      <p className="auth-subheading">Únete hoy y empieza a explorar</p>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nombre</label>
          <input
            className="form-input"
            type="text"
            placeholder="Juan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Apellido</label>
          <input
            className="form-input"
            type="text"
            placeholder="García"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Correo electrónico</label>
        <input
          className="form-input"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Contraseña</label>
        <input
          className="form-input"
          type="password"
          placeholder="Mín. 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <StrengthBar password={password} />
      </div>

      <div className="form-group">
        <label className="form-label">Confirmar contraseña</label>
        <input
          className="form-input"
          type="password"
          placeholder="Repite tu contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn-primary">Crear cuenta</button>

      <p className="terms-text">
        Al registrarte aceptas los <a href="#">Términos de servicio</a> y la{" "}
        <a href="#">Política de privacidad</a>
      </p>
    </form>
  );
}

export default function AuthApp() {
  const [page, setPage] = useState("login");

  return (
    <>
      <style>{styles}</style>
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-icon"><BrandIcon /></div>
          <span className="brand-name">Nexus</span>
        </div>

        <div className="tab-bar">
          <button
            className={`tab${page === "login" ? " active" : ""}`}
            onClick={() => setPage("login")}
          >
            Iniciar sesión
          </button>
          <button
            className={`tab${page === "register" ? " active" : ""}`}
            onClick={() => setPage("register")}
          >
            Crear cuenta
          </button>
        </div>

        {page === "login" ? (
          <LoginPage onSwitchToRegister={() => setPage("register")} />
        ) : (
          <RegisterPage />
        )}
      </div>
    </>
  );
}
