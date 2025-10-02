'use client';

import LoadingSpinner from "@/components/loading/Loading";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const redirectPath =
        user.role === "USER" ? "/home" :
        user.role === "SELLER" ? "/seller" :
        "/admin";
      router.replace(redirectPath);
    }
  }, [user, isLoading, hydrated]);

  
  if (isLoading || !hydrated) return <LoadingSpinner />;

  return <>{children}</>;
};

export default ProtectedRoute;
