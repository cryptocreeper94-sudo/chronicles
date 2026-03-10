/* ====== Chronicles — API Client ====== */
const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiRequest<T = any>(
    method: string,
    path: string,
    body?: any
): Promise<T> {
    const token = localStorage.getItem('chronicles_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(err.error || `API Error ${res.status}`)
    }

    // Handle audio/binary responses
    if (res.headers.get('content-type')?.includes('audio')) {
        return res.blob() as any
    }

    return res.json()
}

export const api = {
    get: <T = any>(path: string) => apiRequest<T>('GET', path),
    post: <T = any>(path: string, body?: any) => apiRequest<T>('POST', path, body),
    put: <T = any>(path: string, body?: any) => apiRequest<T>('PUT', path, body),
    patch: <T = any>(path: string, body?: any) => apiRequest<T>('PATCH', path, body),
    delete: <T = any>(path: string) => apiRequest<T>('DELETE', path),
}
