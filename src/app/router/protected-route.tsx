import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useCurrentUser } from "../../shared/hooks/use-current-user";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}