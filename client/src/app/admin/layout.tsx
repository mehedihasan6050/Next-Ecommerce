'use client';

import Sidebar from '@/components/admin/adminSidebar';
import NavBar from '@/components/seller/navbar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={cn(
          'transition-all duration-300',
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16',
          'min-h-screen'
        )}
      >
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
