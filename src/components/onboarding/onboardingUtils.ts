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
