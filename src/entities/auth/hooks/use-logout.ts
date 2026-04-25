import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../model/auth.store";
import { queryClient } from "../../../shared/lib/queryClient";
import { AuthService } from "../api/auth.service";


export function useLogout() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      return true;
    },

    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },

    onError: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}