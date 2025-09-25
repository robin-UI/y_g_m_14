// This thing need to change because one store wrape another store will cause all state change will re-render all children
'use client'

import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { useStore } from 'zustand'
import { useSession } from 'next-auth/react'

import { type UserStore, createUserStore, getDefaultInitState } from '@/stores/user-store'

export type UserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
)

export interface StoreProviderProps {
  children: ReactNode
}

export const StoreProvider = ({
  children,
}: StoreProviderProps) => {
  const { data: session } = useSession()
  const userStoreRef = useRef<UserStoreApi | null>(null)

  if (userStoreRef.current === null) {
    userStoreRef.current = createUserStore(getDefaultInitState(session))
  }

  useEffect(() => {
    if (userStoreRef.current) {
      userStoreRef.current.getState().setUserFromSession(session)
    }
  }, [session])

  return (
    <UserStoreContext.Provider value={userStoreRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}

export const useUserStore = <T,>(
  selector: (store: UserStore) => T,
): T => {
  const userStoreContext = useContext(UserStoreContext)

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within StoreProvider`)
  }

  return useStore(userStoreContext, selector)
}
