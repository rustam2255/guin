import { useAuthStore } from "../../entities/auth/model/auth.store";

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const profile = useAuthStore((state) => state.profile);

  return {
    isAuthenticated,
    user: profile,
  };
}