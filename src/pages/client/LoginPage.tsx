import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Lock, Envelope, WarningCircle, ArrowRight } from '@phosphor-icons/react'
import './LoginPage.css'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { signIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await signIn(email, password)
            navigate(from, { replace: true })
        } catch (err) {
            console.error('Login error:', err)
            setError((err as Error).message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="login-page">
            {/* Technical Grid Background */}
            <div className="login-grid-bg" />

            <div className="login-container">
                {/* Logo & Brand */}
                <div className="login-brand">
                    <img
                        src="/logo.svg"
                        alt="Automation Affairs"
                        className="login-logo"
                    />
                    <div className="login-brand-text">
                        <span className="login-brand-name">AUTOMATION<span className="brand-accent">AFFAIRS</span></span>
                        <span className="login-brand-tagline">CLIENT PORTAL</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="login-card">
                    <div className="login-card-header">
                        <h1>Willkommen zurück</h1>
                        <p>Melden Sie sich an, um Ihre Projekte zu verwalten.</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <WarningCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="login-field">
                            <label htmlFor="email">E-MAIL</label>
                            <div className="login-input-wrapper">
                                <Envelope size={18} className="login-input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ihre@email.com"
                                    required
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="login-field">
                            <label htmlFor="password">PASSWORT</label>
                            <div className="login-input-wrapper">
                                <Lock size={18} className="login-input-icon" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="login-loading">
                                    <span className="login-spinner" />
                                    Anmeldung läuft...
                                </span>
                            ) : (
                                <>
                                    Anmelden
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>Noch kein Zugang? <a href="mailto:hello@automationaffairs.com">Kontaktieren Sie uns</a></p>
                    </div>
                </div>

                {/* System Status */}
                <div className="login-status">
                    <span className="status-dot" />
                    <span>SYSTEM ONLINE</span>
                </div>
            </div>
        </div>
    )
}
