import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../api/auth.service";
import { useAuthStore } from "../model/auth.store";

export function useLogin() {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
     

      setTokens({
        access: data.access,
        refresh: data.refresh,
      });
    },
    onError: (_error) => {
    },
  });
}