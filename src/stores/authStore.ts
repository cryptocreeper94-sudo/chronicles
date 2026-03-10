/* ====== Chronicles — Auth Store ====== */
import { create } from 'zustand'
import { api } from '../services/api'

interface AuthState {
    userId: string | null
    token: string | null
    username: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null

    login: (email: string, password: string) => Promise<void>
    signup: (email: string, password: string, username: string) => Promise<void>
    devLogin: () => void
    checkSession: () => Promise<void>
    logout: () => void
    linkTrustLayer: () => Promise<{ chatToken: string; chatUser: any } | null>
}

export const useAuthStore = create<AuthState>((set, get) => ({
    userId: localStorage.getItem('chronicles_userId'),
    token: localStorage.getItem('chronicles_token'),
    username: localStorage.getItem('chronicles_username'),
    isAuthenticated: !!localStorage.getItem('chronicles_token'),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post<{ token: string; userId: string; username: string }>(
                '/api/chronicles/auth/login',
                { email, password }
            )
            localStorage.setItem('chronicles_token', res.token)
            localStorage.setItem('chronicles_userId', res.userId)
            localStorage.setItem('chronicles_username', res.username || email)
            set({ token: res.token, userId: res.userId, username: res.username, isAuthenticated: true, loading: false })
        } catch (err: any) {
            set({ error: err.message, loading: false })
        }
    },

    devLogin: () => {
        const devToken = 'dev-mode-' + Date.now()
        const devUserId = 'dev-user-001'
        const devUsername = 'Chronicler'
        localStorage.setItem('chronicles_token', devToken)
        localStorage.setItem('chronicles_userId', devUserId)
        localStorage.setItem('chronicles_username', devUsername)
        set({ token: devToken, userId: devUserId, username: devUsername, isAuthenticated: true, loading: false, error: null })
    },

    signup: async (email, password, username) => {
        set({ loading: true, error: null })
        try {
            const res = await api.post<{ token: string; userId: string }>(
                '/api/chronicles/auth/signup',
                { email, password, username }
            )
            localStorage.setItem('chronicles_token', res.token)
            localStorage.setItem('chronicles_userId', res.userId)
            localStorage.setItem('chronicles_username', username)
            set({ token: res.token, userId: res.userId, username, isAuthenticated: true, loading: false })
        } catch (err: any) {
            set({ error: err.message, loading: false })
        }
    },

    checkSession: async () => {
        const token = localStorage.getItem('chronicles_token')
        if (!token) return
        try {
            const res = await api.get<{ userId: string; username: string }>('/api/chronicles/auth/session')
            set({ userId: res.userId, username: res.username, isAuthenticated: true })
        } catch {
            get().logout()
        }
    },

    logout: () => {
        localStorage.removeItem('chronicles_token')
        localStorage.removeItem('chronicles_userId')
        localStorage.removeItem('chronicles_username')
        set({ token: null, userId: null, username: null, isAuthenticated: false })
    },

    linkTrustLayer: async () => {
        try {
            const res = await api.post<{ chatToken: string; chatUser: any }>('/api/chronicles/chat/link')
            return res
        } catch {
            return null
        }
    },
}))
