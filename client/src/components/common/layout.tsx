'use client';

import { usePathname } from 'next/navigation';
import HomeNavBar from '../home/Navbar';

const pathsNotToShowHeaders = ['/auth', '/seller', '/admin'];

function CommonLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const showHeader = !pathsNotToShowHeaders.some(currentPath =>
    pathName.startsWith(currentPath)
  );

  return (
    <div className="min-h-screen bg-white">
      {showHeader && <HomeNavBar />}
      <main>{children}</main>
    </div>
  );
}

export default CommonLayout;
