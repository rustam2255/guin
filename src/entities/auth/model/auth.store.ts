import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ProfileInfo } from "../types/auth.types"

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  profile: ProfileInfo | null
  isAuthenticated: boolean

  setTokens: (tokens: { access: string; refresh: string }) => void
  setProfile: (profile: ProfileInfo | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      profile: null,
      isAuthenticated: false,

      setTokens: ({ access, refresh }) =>
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        }),

      setProfile: (profile) => set({ profile }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          profile: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
)