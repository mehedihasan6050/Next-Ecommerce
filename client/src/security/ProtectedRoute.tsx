import { useEffect } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";


interface Props {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // যদি login না করে
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
  let redirectPath = "/auth/login";

  if (user.role === "ADMIN") redirectPath = "/admin";
  else if (user.role === "USER") redirectPath = "/home";
  else if (user.role === "SELLER") {
    const currentPath = window.location.pathname;
   
    if (!currentPath.startsWith("/seller")) {
      redirectPath = "/seller";
    } else {
      return; 
    }
  }

  router.replace(redirectPath);
}
    }
  }, [user, isLoading, router, allowedRoles]);

  if (!user || isLoading) return <div>Loading...</div>;
  return <>{children}</>;
};

export default ProtectedRoute;
