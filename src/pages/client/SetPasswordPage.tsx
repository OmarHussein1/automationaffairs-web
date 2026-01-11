import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Lock, AlertCircle, ArrowRight, Check, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import './SetPasswordPage.css'

type PageState = 'loading' | 'ready' | 'invalid_token' | 'expired_token' | 'success'

export default function SetPasswordPage() {
    const [pageState, setPageState] = useState<PageState>('loading')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    // Password validation
    const passwordMinLength = 8
    const isPasswordLongEnough = password.length >= passwordMinLength
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const isPasswordStrong = isPasswordLongEnough && hasUppercase && hasLowercase && hasNumber
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

    // Extract tokens from URL hash and set session on mount
    useEffect(() => {
        const processTokens = async () => {
            try {
                // Parse hash parameters
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const refreshToken = hashParams.get('refresh_token')
                const type = hashParams.get('type')

                console.log('[SetPassword] Processing tokens, type:', type)

                // Validate we have the necessary tokens
                if (!accessToken) {
                    console.error('[SetPassword] No access token found in URL')
                    setPageState('invalid_token')
                    return
                }

                // Set the session with the tokens
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || ''
                })

                if (sessionError) {
                    console.error('[SetPassword] Session error:', sessionError)
                    // Check if the error is due to an expired token
                    if (sessionError.message?.toLowerCase().includes('expired')) {
                        setPageState('expired_token')
                    } else {
                        setPageState('invalid_token')
                    }
                    return
                }

                // Clear the hash from the URL for security (without reloading)
                window.history.replaceState(null, '', window.location.pathname)

                console.log('[SetPassword] Session set successfully')
                setPageState('ready')
            } catch (err) {
                console.error('[SetPassword] Unexpected error:', err)
                setPageState('invalid_token')
            }
        }

        processTokens()
    }, [])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)

        // Validate passwords
        if (!isPasswordStrong) {
            setError('Please create a stronger password. It must be at least 8 characters with uppercase, lowercase, and a number.')
            return
        }

        if (!passwordsMatch) {
            setError('Passwords do not match. Please re-enter your password.')
            return
        }

        setIsLoading(true)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) {
                console.error('[SetPassword] Update error:', updateError)
                setError(updateError.message || 'Failed to set password. Please try again.')
                return
            }

            console.log('[SetPassword] Password set successfully')
            setPageState('success')

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard', { replace: true })
            }, 2000)
        } catch (err) {
            console.error('[SetPassword] Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Render different states
    const renderContent = () => {
        switch (pageState) {
            case 'loading':
                return (
                    <div className="setpassword-card">
                        <div className="setpassword-loading-state">
                            <span className="setpassword-spinner-large" />
                            <p>Verifying your invitation link...</p>
                        </div>
                    </div>
                )

            case 'invalid_token':
                return (
                    <div className="setpassword-card">
                        <div className="setpassword-error-state">
                            <div className="error-icon-wrapper">
                                <ShieldAlert size={48} />
                            </div>
                            <h2>Invalid Invitation Link</h2>
                            <p>
                                This link is invalid or has already been used.
                                Please contact Automation Affairs for a new invitation.
                            </p>
                            <a href="mailto:hello@automationaffairs.com" className="setpassword-contact-link">
                                Contact Support
                            </a>
                        </div>
                    </div>
                )

            case 'expired_token':
                return (
                    <div className="setpassword-card">
                        <div className="setpassword-error-state">
                            <div className="error-icon-wrapper expired">
                                <ShieldAlert size={48} />
                            </div>
                            <h2>Link Expired</h2>
                            <p>
                                This invitation link has expired.
                                Please request a new invitation from your Automation Affairs contact.
                            </p>
                            <a href="mailto:hello@automationaffairs.com" className="setpassword-contact-link">
                                Request New Invitation
                            </a>
                        </div>
                    </div>
                )

            case 'success':
                return (
                    <div className="setpassword-card">
                        <div className="setpassword-success-state">
                            <div className="success-icon-wrapper">
                                <Check size={48} />
                            </div>
                            <h2>Password Set Successfully!</h2>
                            <p>
                                Your account is ready. Redirecting you to the dashboard...
                            </p>
                            <span className="setpassword-spinner" />
                        </div>
                    </div>
                )

            case 'ready':
            default:
                return (
                    <div className="setpassword-card">
                        <div className="setpassword-card-header">
                            <h1>Create Your Password</h1>
                            <p>Welcome to the Automation Affairs Client Portal. Please create a secure password to access your projects.</p>
                        </div>

                        {error && (
                            <div className="setpassword-error">
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="setpassword-form">
                            <div className="setpassword-field">
                                <label htmlFor="password">PASSWORD</label>
                                <div className="setpassword-input-wrapper">
                                    <Lock size={18} className="setpassword-input-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
                                        required
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Password strength indicators */}
                                <div className="password-requirements">
                                    <div className={`requirement ${isPasswordLongEnough ? 'met' : ''}`}>
                                        <Check size={14} />
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`requirement ${hasUppercase ? 'met' : ''}`}>
                                        <Check size={14} />
                                        <span>One uppercase letter</span>
                                    </div>
                                    <div className={`requirement ${hasLowercase ? 'met' : ''}`}>
                                        <Check size={14} />
                                        <span>One lowercase letter</span>
                                    </div>
                                    <div className={`requirement ${hasNumber ? 'met' : ''}`}>
                                        <Check size={14} />
                                        <span>One number</span>
                                    </div>
                                </div>
                            </div>

                            <div className="setpassword-field">
                                <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
                                <div className="setpassword-input-wrapper">
                                    <Lock size={18} className="setpassword-input-icon" />
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {confirmPassword.length > 0 && (
                                    <div className={`password-match ${passwordsMatch ? 'matching' : 'not-matching'}`}>
                                        {passwordsMatch ? (
                                            <>
                                                <Check size={14} />
                                                <span>Passwords match</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={14} />
                                                <span>Passwords do not match</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="setpassword-submit"
                                disabled={isLoading || !isPasswordStrong || !passwordsMatch}
                            >
                                {isLoading ? (
                                    <span className="setpassword-loading">
                                        <span className="setpassword-spinner" />
                                        Setting password...
                                    </span>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="setpassword-footer">
                            <p>Already have access? <a href="/login">Sign in here</a></p>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="setpassword-page">
            {/* Technical Grid Background */}
            <div className="setpassword-grid-bg" />

            <div className="setpassword-container">
                {/* Logo & Brand */}
                <div className="setpassword-brand">
                    <img
                        src="/logo.svg"
                        alt="Automation Affairs"
                        className="setpassword-logo"
                    />
                    <div className="setpassword-brand-text">
                        <span className="setpassword-brand-name">AUTOMATION<span className="brand-accent">AFFAIRS</span></span>
                        <span className="setpassword-brand-tagline">CLIENT PORTAL</span>
                    </div>
                </div>

                {/* Dynamic Content */}
                {renderContent()}

                {/* System Status */}
                <div className="setpassword-status">
                    <span className="status-dot" />
                    <span>SYSTEM ONLINE</span>
                </div>
            </div>
        </div>
    )
}
