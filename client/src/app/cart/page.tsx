'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function UserCartPage() {
  const {
    fetchCart,
    items,
    isLoading,
    updateCartItemQuantity,
    removeFromCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    setIsUpdating(true);
    await updateCartItemQuantity(id, Math.max(1, newQuantity));
    setIsUpdating(false);
  };

  const handleRemoveItem = async (id: string) => {
    setIsUpdating(true);
    await removeFromCart(id);
    setIsUpdating(false);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">YOUR CART</h1>
        
        {/* Mobile view - card layout */}
        <div className="md:hidden space-y-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                  <div className="flex flex-wrap gap-x-3 text-xs text-gray-700 mt-1">
                    <p>Color: {item.color}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Button
                    disabled={isUpdating}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    variant={'outline'}
                    size={'icon'}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    className="w-12 h-8 text-center text-sm"
                    value={item.quantity}
                    onChange={e => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                  />
                  <Button
                    disabled={isUpdating}
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    variant={'outline'}
                    size={'icon'}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    disabled={isUpdating}
                    onClick={() => handleRemoveItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="text-xs h-8"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop view - table layout */}
        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-4">PRODUCT</th>
                <th className="text-right py-4 px-4">PRICE</th>
                <th className="text-center py-4 px-4">QUANTITY</th>
                <th className="text-right py-4 px-4">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-700">
                          Color: {item.color}
                        </p>
                        <p className="text-sm text-gray-700">Size: {item.size}</p>
                        <Button
                          disabled={isUpdating}
                          onClick={() => handleRemoveItem(item.id)}
                          variant="destructive"
                          size="sm"
                          className="text-sm mt-2"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        variant={'outline'}
                        size={'icon'}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-16 text-center"
                        value={item.quantity}
                        onChange={e =>
                          handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                      />
                      <Button
                        disabled={isUpdating}
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        variant={'outline'}
                        size={'icon'}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center md:justify-end">
          <div className="w-full md:w-auto md:min-w-[300px] space-y-4 border rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">TOTAL</span>
              <span className="font-bold text-xl ml-4">${total.toFixed(2)}</span>
            </div>
            <Button
              onClick={() => router.push('/checkout')}
              className="w-full bg-black text-white h-12 text-base"
            >
              PROCEED TO CHECKOUT
            </Button>
            <Button
              onClick={() => router.push('/listing')}
              className="w-full h-12 text-base"
              variant="outline"
            >
              CONTINUE SHOPPING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartPage;
