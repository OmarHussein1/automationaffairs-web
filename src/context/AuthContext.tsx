import { createContext, useContext, useEffect, useState, useRef } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
    id: string
    full_name?: string
    avatar_url?: string
    role?: string
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

        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (session?.user) {
                    setUser(session.user)
                    const profileData = await fetchProfile(session.user.id)
                    setProfile(profileData)
                }
            } catch (error) {
                console.error('[AuthProvider] Init error:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('[AuthProvider] Auth event:', event)

                if (event === 'SIGNED_IN' && session?.user) {
                    setUser(session.user)
                    const profileData = await fetchProfile(session.user.id)
                    setProfile(profileData)
                } else if (event === 'SIGNED_OUT') {
                    setUser(null)
                    setProfile(null)
                }

                setLoading(false)
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    // Sign in with email and password
    const signIn = async (email: string, password: string) => {
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setLoading(false)
            throw error
        }

        // Manually update state to ensure instant feedback and avoid race conditions
        // with the onAuthStateChange listener
        if (data?.user) {
            setUser(data.user)
            await fetchProfile(data.user.id)
        }

        setLoading(false)
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
