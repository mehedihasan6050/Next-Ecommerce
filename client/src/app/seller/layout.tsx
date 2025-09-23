'use client';

import NavBar from '@/components/seller/navbar';
import Sidebar from '@/components/seller/sidebar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

function SellerLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Content Area */}
      <div
        className={cn(
          'transition-all duration-300 min-h-screen',
          // শুধু lg breakpoint থেকে margin-left ব্যবহার করবো
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        )}
      >
        <NavBar />
        {children}
      </div>
    </div>
  );
}

export default SellerLayout;
