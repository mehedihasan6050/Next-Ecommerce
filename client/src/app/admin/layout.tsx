'use client';

import AdminNavBar from '@/components/admin/navbar';
import AdminSidebar from '@/components/admin/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-16',
          'min-h-screen'
        )}
      >
        <AdminNavBar />
        {children}
      </div>
    </div>
  );
}

export default SuperAdminLayout;
