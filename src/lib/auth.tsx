import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthState {
  loggedIn: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthState>({ loggedIn: false, login: () => {}, logout: () => {} })

/** Front-end only auth stub so Guest and Logged-in designs can both be previewed. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false)
  return (
    <AuthContext.Provider value={{ loggedIn, login: () => setLoggedIn(true), logout: () => setLoggedIn(false) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
