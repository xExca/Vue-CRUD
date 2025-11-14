import axios from 'axios'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'token'
const url = localStorage.getItem('mockAPI');

function makeFakeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.x`
}
function getToken() { return localStorage.getItem(TOKEN_KEY) }
function getPayload() {
  const token = getToken()
  if (!token) return null
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return null }
}

const user = ref(loadUser())  

function loadUser() {
  const p = getPayload()
  return p ? { name: p.name, role: p.role, exp: p.exp } : null
}

export const isAuthed = computed(() =>
  !!user.value && user.value.exp && Date.now() / 1000 < user.value.exp
)

export function hasRole(role) {
  return isAuthed.value && (!role || user.value.role === role)
}

export function getUser() {
  return user.value ? { name: user.value.name, role: user.value.role } : null
}

export async function login(username, password) {
  try {
    const { data } = await axios.get(`${url}/users?search=${username}`)

    const found = data.find(u => u.user === username && u.password === password)
    if (!found) throw new Error('Invalid username or password')

    const exp = Math.floor(Date.now() / 1000) + 3600
    const token = makeFakeJwt({ name: found.name, role: found.role, exp })

    localStorage.setItem(TOKEN_KEY, token)
    user.value = { name: found.name, role: found.role, exp, id: found.id }

    return {
      status: 200,
      token,
      user: user.value
    }
  } catch (err) {
    console.error('Login failed:', err)
    throw new Error('Unable to log in. Please check credentials or MockAPI link.')
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  user.value = null
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY) user.value = loadUser()
  })
}

export function useAuth() {
  return { user, isAuthed, hasRole }
}
