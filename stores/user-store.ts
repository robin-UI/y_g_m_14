import { createStore } from 'zustand/vanilla'
// import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export type UserState = {
  username: string,
  email: string,
  //   mobileNmber: string
}

export type UserActions = {
  updateUser: () => void
  setUserFromSession: (session: Session | null) => void
}

export type UserStore = UserState & UserActions

export const getDefaultInitState = (session: Session | null = null): UserState => {
  if (session?.user) {
    return {
      username: session.user.username || "",
      email: session.user.email || "",
      // mobileNmber: "",
    }
  }

  return {
    username: "",
    email: "",
    // mobileNmber: "",
  }
}

export const defaultInitState: UserState = getDefaultInitState()

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    updateUser: () => {
      // Implement update logic here
    },
    setUserFromSession: (session: Session | null) => {
      const newState = getDefaultInitState(session)
      set(newState)
    },
  }))
}