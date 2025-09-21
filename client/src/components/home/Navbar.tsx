'use client';

import { Search, Menu, User, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useProductStore } from '@/store/useProductStore';
import { useEffect, useState } from 'react';

export function HomeNavBar() {
  const [query, setQuery] = useState('');

  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { items, fetchCart } = useCartStore();
  const { fetchProductsForClient, search, setSearch } = useProductStore();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const handleSearch = async (value: string) => {
    await fetchProductsForClient({ query: value });
  };

  useEffect(() => {
    handleSearch(query);
    fetchCart();
    if (query === '') {
      setSearch([]);
    }
  }, [fetchCart, query, setSearch]);

  const handleNavigate = () => {
    setSearch([]);
    setQuery('');
    router.push('/listing');
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section - Hamburger menu and brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold">
            NextEcom
          </Link>
        </div>

        {/* Center section - Search bar */}
        <div className="flex-1 max-w-2xl mx-8 relative">
          <div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              value={query}
              placeholder="Search essentials, groceries and more..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm placeholder:text-gray-500 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {search?.length > 0 && (
            <div className="absolute top-full left-0 bg-white shadow-lg border w-full mt-1 rounded max-h-80 overflow-y-auto z-50">
              {search.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-10 h-10 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-red-500 font-bold">
                      ${item.price}
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-center py-2 border-t">
                <button
                  onClick={handleNavigate}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  See all results
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right section - Menu, Sign In, Cart */}
        <div className="flex items-center gap-6">
          <div>
            <Link href="/listing" className="text-sm font-medium">
              Products
            </Link>
          </div>

          {user ? (
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="border bg-gray-300 border-gray-300 p-2 cursor-pointer rounded-full">
                      {user.name
                        ?.trim()
                        .split(/\s+/)
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={handleLogout} className="cursor-pointer">
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer"
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Up/Sign In</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer relative"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">Cart ({items.length})</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default HomeNavBar;
