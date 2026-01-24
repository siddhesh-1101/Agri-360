import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "farmer" | "retailer" | "agent";
}) {
  const { token, user } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return <>{children}</>;
}

