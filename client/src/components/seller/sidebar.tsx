import {
  LayoutDashboard,
  Package,
  List,
  LucideLogOut,
  ChevronRight,
  Menu,
  Puzzle,
  ShoppingCart,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '../ui/button';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/seller',
  },
  { icon: Package, label: 'Products', href: '/seller/products' },
  { icon: Puzzle, label: 'Coupons', href: '/seller/coupons' },
  { icon: List, label: 'Orders', href: '/seller/orders' },
  { icon: LucideLogOut, label: 'Logout', href: '' }


];



function Sidebar({ isOpen, toggle }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push('/auth/login');
  }

  return (

     
      <div
      className={cn(
        'absolute lg:fixed left-0 top-0 z-40 min-h-screen bg-background transition-all duration-300 opacity-30 lg:opacity-100',
        isOpen ? 'w-64 opacity-100' : 'w-22 '
      )}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <h1
              className={cn(
                'text-xl font-semibold text-gray-900',
                !isOpen && 'hidden'
              )}
            >
              NextEcom
            </h1>
            <Button
              variant={'ghost'}
              size={'icon'}
              className="ml-auto"
              onClick={toggle}
            >
              {isOpen ? (
                <Menu className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="space-y-1">
            {navigationItems.map(item => (
              <div
                key={item.label}
                onClick={
                    item.label === 'Logout'
                      ? handleLogout
                      : () => router.push(item.href)
                  }
                className={cn(
                  'flex items-center cursor-pointer gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className={cn('ml-3', !isOpen && 'hidden')}>
                  {item.label}
                </span>
              </div>
            ))}
          </nav>
  
         
        </div>
        </div>
  
     
  );
}

export default Sidebar;
