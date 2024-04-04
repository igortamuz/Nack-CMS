import React, {createContext, useState, useContext, useCallback} from 'react'
import api from '../api'

import { IUser } from './interfaces/IUser'
import { IAuthContext } from './interfaces/IAuthContext'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

const getUserFromToken = (token: string | null) => {
  try {
    if (token) {
      return JSON.parse(atob(token.split('.')[1]))
    }
  } catch (error) {
    return null
  }
}

const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<IUser>(() => {
    const token = localStorage.getItem('@Gosorte:token')
    const user = getUserFromToken(token)
    if (token && user){
      api.defaults.headers.authorization = `Bearer ${token}`
      return {token, user}
    }
    return {} as IUser
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@Gosorte:token')
    setData({} as IUser)
  }, [])

  const signIn = useCallback(async ({email, password}): Promise<any> => {
    try{
      const res = await api.post('login', {email, password})
      const token = res.data
      const user = getUserFromToken(token)

      localStorage.setItem('@Gosorte:token', token)
      api.defaults.headers.authorization = `Bearer ${token}`
      setData({token, user})
      return true
    }catch(e){
      return false
    }
  }, [])

  const updateAuth = useCallback(() => {
    const token = localStorage.getItem('@Gosorte:token') || ''
    const user = getUserFromToken(token)
    if (token !== data.token){
      setData({token, user})
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        signIn,
        signOut,
        updateAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext)
  if (!context){
    throw new Error("Auth must be used withing AuthProvider")
  }
  return context
}

export default AuthProvider