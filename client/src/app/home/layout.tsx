'use client';

import ProtectedRoute from "@/security/ProtectedRoute";


function SellerLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <div>
         <ProtectedRoute allowedRoles={["USER"]}>
      {children}
    </ProtectedRoute>
      </div>
  
  );
}

export default SellerLayout;
