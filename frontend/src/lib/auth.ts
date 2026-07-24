import { User, LoginResponse } from '@/types'
import api from './api'

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/auth/login', { username, password })
  const data = response.data

  if (data.success && typeof window !== 'undefined') {
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    setCookie('token', data.data.token, 7)
  }

  return data.data
}

export async function citizenLogin(phoneNumber: string, password: string): Promise<any> {
  const response = await api.post('/Citizens/login', { phoneNumber, password })
  const data = response.data

  if (data.success && typeof window !== 'undefined') {
    localStorage.setItem('citizenToken', data.data.token)
    localStorage.setItem('citizen', JSON.stringify(data.data.citizen))
    setCookie('citizenToken', data.data.token, 7)
  }

  return data.data
}

export async function citizenLogout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('citizenToken')
    localStorage.removeItem('citizen')
    deleteCookie('citizenToken')
    window.location.href = '/citizen/login'
  }
}

export async function policeLogin(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post('/auth/login', { username, password })
  const data = response.data

  if (data.success && typeof window !== 'undefined') {
    localStorage.setItem('policeToken', data.data.token)
    localStorage.setItem('policeUser', JSON.stringify(data.data.user))
    setCookie('policeToken', data.data.token, 7)
  }

  return data.data
}

export async function policeLogout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('policeToken')
    localStorage.removeItem('policeUser')
    deleteCookie('policeToken')
    window.location.href = '/police/login'
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await api.get('/auth/me')
    return response.data.data
  } catch {
    return null
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const response = await api.post('/auth/change-password', { currentPassword, newPassword })
  return response.data.success
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    deleteCookie('token')
    window.location.href = '/login'
  }
}

export function getStoredUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function getStoredPoliceUser(): User | null {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('policeUser')
    return user ? JSON.parse(user) : null
  }
  return null
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function hasRole(...roles: string[]): boolean {
  const user = getStoredUser()
  return user ? roles.includes(user.role) : false
}
