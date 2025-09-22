'use client';

import NavBar from '@/components/seller/navbar';
import Sidebar from '@/components/seller/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function SellerLayout({ children }: { children: React.ReactNode }) {
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
          isSidebarOpen ? 'ml-64' : 'ml-16',
          'min-h-screen'
        )}
      >
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default SellerLayout;
