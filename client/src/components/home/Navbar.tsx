import { Search, Menu, User, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function HomeNavBar() {
  return (
    <header className="w-full bg-white border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left section - Hamburger menu and brand */}
        <div className="flex items-center gap-4">
          <Link href='/' className="text-2xl font-bold">NextEcom</Link>
        </div>

        {/* Center section - Search bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search essentials, groceries and more..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-gray-200 rounded-lg text-sm placeholder:text-gray-500 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Right section - Menu, Sign In, Cart */}
        <div className="flex items-center gap-6">

          <div>
            <Link href='/listing' className="text-sm font-medium">Products</Link>
            
          </div>
          
          <div className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Up/Sign In</span>
          </div>

          <Link href='/cart' className="flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer relative">
            <div className="bg-red-500 text-white w-5 h-5 text-center text-xs rounded-full absolute -top-2 -right-4">
              (4)
          </div>
            <ShoppingCart className="h-4 w-4" />
            <span className="text-sm font-medium">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default HomeNavBar