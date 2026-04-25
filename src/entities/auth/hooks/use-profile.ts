import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../api/auth.service";
import { useAuthStore } from "../model/auth.store";

export function useProfile() {
  const setProfile = useAuthStore((state) => state.setProfile);
  const accessToken = useAuthStore((state) => state.accessToken);

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: AuthService.getProfile,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (query.data) {
      setProfile(query.data);
    }
  }, [query.data, setProfile]);

  return query;
}