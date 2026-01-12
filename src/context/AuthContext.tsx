import { createContext, useContext, useEffect, useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
    id: string
    full_name?: string
    avatar_url?: string
    role?: string
    last_seen?: string | null
    [key: string]: unknown
}

interface AuthContextType {
    user: User | null
    profile: Profile | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ user: User; session: Session } | null>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<Profile | null>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const initRef = useRef(false)

    // Fetch user profile from profiles table
    const fetchProfile = async (userId: string): Promise<Profile | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('[AuthProvider] Profile fetch error:', error)
                return null
            }

            return data as Profile
        } catch (err) {
            console.error('[AuthProvider] Profile fetch exception:', err)
            return null
        }
    }

    // Update last_seen timestamp in profiles table
    // Fire-and-forget: don't block user experience for analytics
    const updateLastSeen = async (userId: string) => {
        try {
            await supabase
                .from('profiles')
                .update({ last_seen: new Date().toISOString() })
                .eq('id', userId)
        } catch (error) {
            // Silent fail - don't block user experience for analytics
            console.error('[AuthProvider] Failed to update last_seen:', error)
        }
    }

    // Refresh profile data
    const refreshProfile = async (): Promise<Profile | null> => {
        if (user?.id) {
            const profileData = await fetchProfile(user.id)
            setProfile(profileData)
            return profileData
        }
        return null
    }

    useEffect(() => {
        // Prevent double initialization in React Strict Mode
        if (initRef.current) return
        initRef.current = true

        let isMounted = true

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                // Check if component is still mounted before updating state
                if (!isMounted) return

                if (session?.user) {
                    setUser(session.user)
                    const profileData = await fetchProfile(session.user.id)
                    if (isMounted) {
                        setProfile(profileData)
                    }
                }
            } catch (error) {
                // Ignore AbortError - this happens when component unmounts during fetch
                if (error instanceof Error && error.name === 'AbortError') {
                    console.log('[AuthProvider] Init aborted (component unmounted)')
                    return
                }
                console.error('[AuthProvider] Init error:', error)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        // Listen for auth changes
        // IMPORTANT: This callback must be synchronous to avoid blocking signInWithPassword
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!isMounted) return

                console.log('[AuthProvider] Auth event:', event)

                if (event === 'SIGNED_IN' && session?.user) {
                    setUser(session.user)
                    // Fire-and-forget: update last_seen timestamp
                    updateLastSeen(session.user.id)
                    // Fire-and-forget profile fetch - don't block the auth flow
                    fetchProfile(session.user.id).then(profileData => {
                        if (isMounted) {
                            setProfile(profileData)
                        }
                    }).catch(error => {
                        console.error('[AuthProvider] Profile fetch error:', error)
                    })
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setProfile(null)
                }

                if (isMounted) {
                    setLoading(false)
                }
            }
        )

        return () => {
            isMounted = false
            subscription?.unsubscribe()
        }
    }, [])

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        console.log('[AuthProvider] signIn called')
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.error('[AuthProvider] signIn error:', error)
            setLoading(false)
            throw error
        }

        console.log('[AuthProvider] signIn successful, user:', data?.user?.id)

        // Manually update state to ensure instant feedback and avoid race conditions
        // with the onAuthStateChange listener
        if (data?.user) {
            setUser(data.user)
            // Fire-and-forget: update last_seen timestamp
            updateLastSeen(data.user.id)
            try {
                const profileData = await fetchProfile(data.user.id)
                setProfile(profileData)
                console.log('[AuthProvider] Profile loaded:', profileData?.full_name)
            } catch (profileError) {
                // Profile fetch failed, but login was still successful
                console.warn('[AuthProvider] Profile fetch failed, continuing without profile:', profileError)
            }
        }

        setLoading(false)
        console.log('[AuthProvider] signIn complete, loading set to false')
        return data
    }

    // Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
        setUser(null)
        setProfile(null)
    }

    const value: AuthContextType = {
        user,
        profile,
        loading,
        signIn,
        signOut,
        refreshProfile,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
