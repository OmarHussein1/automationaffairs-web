import { useState } from 'react'
import {
    Briefcase, CheckCircle, BookOpen, ChatCircle,
    Envelope, ArrowRight, Question, Rocket
} from '@phosphor-icons/react'
import './OnboardingModal.css'

interface OnboardingModalProps {
    isOpen: boolean
    onClose: () => void
    userName?: string
}

const ONBOARDING_STORAGE_KEY = 'aa_onboarding_completed'

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding(): boolean {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true'
}

/**
 * Mark onboarding as completed
 */
export function markOnboardingComplete(): void {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true')
}

/**
 * Reset onboarding state (for testing or re-showing)
 */
export function resetOnboarding(): void {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
}

export default function OnboardingModal({ isOpen, onClose, userName }: OnboardingModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(true)

    if (!isOpen) return null

    const handleClose = () => {
        if (dontShowAgain) {
            markOnboardingComplete()
        }
        onClose()
    }

    const displayName = userName?.split(' ')[0] || 'there'

    return (
        <div className="onboarding-overlay" onClick={handleClose}>
            <div className="onboarding-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="onboarding-header">
                    <div className="onboarding-brand">
                        <img src="/logo.svg" alt="AA" className="onboarding-logo" />
                        <span className="onboarding-brand-text">
                            AUTOMATION<span className="brand-accent">AFFAIRS</span>
                        </span>
                    </div>
                    <h1>Willkommen, {displayName}!</h1>
                    <p>
                        Ihr zentrales Portal für Projekttransparenz und Zusammenarbeit.
                        Hier verwalten wir gemeinsam Ihre Automatisierungsprojekte.
                    </p>
                </div>

                {/* Content */}
                <div className="onboarding-content">
                    {/* Projects */}
                    <div className="onboarding-section">
                        <h2>
                            <Briefcase size={20} />
                            Ihre Projekte
                        </h2>
                        <p>
                            Übersicht aller aktiven und abgeschlossenen Projekte. Jedes Projekt zeigt
                            den <span className="onboarding-highlight">aktuellen Status</span>, die
                            Deadline und den Fortschritt auf einen Blick.
                        </p>
                    </div>

                    {/* Tasks & Progress */}
                    <div className="onboarding-section">
                        <h2>
                            <CheckCircle size={20} />
                            Tasks & Fortschritt
                        </h2>
                        <p>
                            Der <span className="onboarding-highlight">Projektfortschritt</span> berechnet
                            sich automatisch aus dem Verhältnis abgeschlossener zu offenen Tasks.
                            So sehen Sie jederzeit, wo wir stehen.
                        </p>
                    </div>

                    {/* Knowledge Base */}
                    <div className="onboarding-section">
                        <h2>
                            <BookOpen size={20} />
                            Knowledge Base
                        </h2>
                        <p>
                            Zugang zu projektrelevanten Artikeln, Dokumentationen und Insights.
                            Wir teilen hier Wissen, das für Ihre Projekte wichtig ist –
                            von technischen Details bis zu Best Practices.
                        </p>
                    </div>

                    <div className="onboarding-divider" />

                    {/* Coming Soon */}
                    <div className="onboarding-section coming-soon">
                        <h2>
                            <Rocket size={20} />
                            Coming Soon
                        </h2>
                        <p className="coming-soon-intro">
                            Wir arbeiten kontinuierlich an der Weiterentwicklung Ihres Client Portals.
                            Folgende Features sind bereits in Planung:
                        </p>
                        <ul className="coming-soon-list">
                            <li>
                                <strong>Status & Error Logs</strong> – Echtzeit-Monitoring Ihrer
                                Automation Affairs Softwarelösungen direkt im Portal
                            </li>
                            <li>
                                <strong>Ticketing System</strong> – Projekt- und Taskanfragen
                                strukturiert einreichen und verfolgen
                            </li>
                            <li>
                                <strong>Stundenkontingent-Management</strong> – Arbeitszeit-Kontingente
                                freigeben und transparent nachverfolgen, wofür wir Ihre Zeit einsetzen
                            </li>
                            <li>
                                <strong>Custom Client Agent</strong> – Ihr persönlicher KI-Assistent,
                                der Sie zu allen Ihren AA-Projekten berät
                            </li>
                        </ul>
                        <p className="coming-soon-feedback">
                            <strong>Haben Sie Vorschläge oder Ideen?</strong> Wir freuen uns über
                            Ihr Feedback zur Weiterentwicklung des Portals!
                        </p>
                    </div>

                    <div className="onboarding-divider" />

                    {/* Contact */}
                    <div className="onboarding-section">
                        <h2>
                            <Question size={20} />
                            Fragen? Wir sind für Sie da.
                        </h2>
                        <p>
                            Bei Fragen zu Projekten oder Ihrem Portal erreichen Sie uns jederzeit:
                        </p>
                        <div className="onboarding-contact">
                            <a
                                href="mailto:hello@automationaffairs.com"
                                className="onboarding-contact-item"
                            >
                                <Envelope size={16} />
                                hello@automationaffairs.com
                            </a>
                            <a
                                href="https://wa.me/436605358688"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="onboarding-contact-item"
                            >
                                <ChatCircle size={16} />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="onboarding-footer">
                    <label className="onboarding-checkbox">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <span>Nicht mehr anzeigen</span>
                    </label>
                    <button className="onboarding-btn" onClick={handleClose}>
                        Los geht's
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
