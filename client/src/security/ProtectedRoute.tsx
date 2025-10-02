import LoadingSpinner from "@/components/loading/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props { children: React.ReactNode; allowedRoles: string[]; }

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        const redirectPath =
          user.role === "USER"
            ? "/home"
            : user.role === "SELLER"
            ? "/seller"
            : "/admin";
        router.replace(redirectPath);
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (!user || isLoading) return <LoadingSpinner />;
  return <>{children}</>;
};

export default ProtectedRoute;