'use client';

import { paymentAction } from '@/action/payment';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAddressStore } from '@/store/useAddressStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CartItem, useCartStore } from '@/store/useCartStore';
import { Coupon, useCouponStore } from '@/store/useCouponStore';
import { useProductStore } from '@/store/useProductStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PurchaseModal from './purchaseModal';

function CheckoutContent() {
  const [paymentOpen, setPaymentOpen] = useState<boolean>(false);
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { product: any })[]
  >([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponAppliedError, setCouponAppliedError] = useState('');
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();
  const { fetchCoupons, couponList } = useCouponStore();

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
    fetchCart();
  }, [fetchAddresses, fetchCart, fetchCoupons]);

  useEffect(() => {
    const findDefaultAddress = addresses.find(address => address.isDefault);

    if (findDefaultAddress) {
      setSelectedAddress(findDefaultAddress.id);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchIndividualProductDetails = async () => {
      const itemsWithDetails = await Promise.all(
        items.map(async item => {
          const product = await getProductById(item.productId);
          return { ...item, product };
        })
      );

      setCartItemsWithDetails(itemsWithDetails);
    };

    fetchIndividualProductDetails();
  }, [items, getProductById]);

  function handleApplyCoupon() {
    const getCurrentCoupon = couponList.find(c => c.code === couponCode);

    if (!getCurrentCoupon) {
      setCouponAppliedError('Invalied Coupon code');
      setAppliedCoupon(null);
      return;
    }

    const getSellerIds = cartItemsWithDetails.map(
      item => item?.product?.sellerId
    );

    if (!getSellerIds.includes(getCurrentCoupon.sellerId)) {
      setCouponAppliedError('Coupon Applicable Selected Seller Only');
      setAppliedCoupon(null);
      return;
    }

    const now = new Date();

    if (
      now < new Date(getCurrentCoupon.startDate) ||
      now > new Date(getCurrentCoupon.endDate)
    ) {
      setCouponAppliedError(
        'Coupon is not valid in this time or expired coupon'
      );
      setAppliedCoupon(null);
      return;
    }

    if (getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit) {
      setCouponAppliedError(
        'Coupon has reached its usage limit! Please try a diff coupon'
      );
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(getCurrentCoupon);
    setCouponAppliedError('');
  }

  const subTotal = cartItemsWithDetails.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? (subTotal * appliedCoupon.discountPercent) / 100
    : 0;

  const totalPrice = subTotal - discountAmount;

  const handlePrePaymentFlow = async () => {
    const result = await paymentAction(checkoutEmail);
    if (!result.success) {
      toast(result.error);

      return;
    }

    setShowPaymentFlow(true);
  };

  const orderData = {
    userId: user?.id,
    name: user?.name,
    addressId: selectedAddress,
    productIds: cartItemsWithDetails.map(item => item.productId),
    items: cartItemsWithDetails.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      productCategory: item.product.category,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price,
      sellerId: item.product.sellerId,
    })),
    couponId: appliedCoupon?.id,
    totalPrice: totalPrice,
    checkoutEmail: checkoutEmail,
  };

  console.log(cartItemsWithDetails);

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Order summary for mobile - shown at top */}
          <div className="lg:hidden mb-4">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-3">Order summary</h2>
              <div className="space-y-3">
                {cartItemsWithDetails.map(item => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item?.product?.images[0]}
                        alt={item?.product?.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item?.product?.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.color} / {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm whitespace-nowrap">
                      ${(item?.product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-500 text-sm">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Delivery</h2>
              <div className="space-y-3 sm:space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={address.id}
                      checked={selectedAddress === address.id}
                      onCheckedChange={() => setSelectedAddress(address.id)}
                      className="mt-1"
                    />
                    <Label htmlFor={address.id} className="flex-grow ml-2">
                      <div>
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <span className="ml-2 text-xs sm:text-sm text-green-600">
                            (Default)
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700">
                        {address.address}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {address.city}, {address.country}, {address.postalCode}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {address.phone}
                      </div>
                    </Label>
                  </div>
                ))}
                <Button 
                  onClick={() => router.push('/account')}
                  className="mt-2 text-sm sm:text-base"
                >
                  Add a new Address
                </Button>
              </div>
            </Card>
            <Card className="p-4 sm:p-6">
              {showPaymentFlow ? (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Payment</h3>
                  <p className="mb-3 text-sm sm:text-base">
                    All transactions are secure and encrypted
                  </p>
                  <Button
                    className="w-full cursor-pointer h-10 sm:h-12 text-sm sm:text-base"
                    onClick={() => setPaymentOpen(true)}
                  >
                    Place Order
                  </Button>

                  {paymentOpen && (
                    <PurchaseModal
                      isOpen={paymentOpen}
                      closeModal={() => setPaymentOpen(false)}
                      productInfo={orderData}
                      clearCart={clearCart}
                    />
                  )}
                </div>
              ) : (
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                    Enter Email to get started
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                      value={checkoutEmail}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setCheckoutEmail(event.target.value)
                      }
                    />
                    <Button 
                      onClick={handlePrePaymentFlow}
                      className="sm:whitespace-nowrap text-sm sm:text-base"
                    >
                      Proceed to Buy
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
          
          {/* Order summary for desktop - shown on right */}
          <div className="hidden lg:block">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Order summary</h2>
              <div className="space-y-4">
                {cartItemsWithDetails.map(item => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <img
                        src={item?.product?.images[0]}
                        alt={item?.product?.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{item?.product?.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium whitespace-nowrap">
                      ${(item?.product?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <Input
                    placeholder="Enter a Discount code or Gift code"
                    onChange={e => setCouponCode(e.target.value)}
                    value={couponCode}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    className="w-full"
                    variant="outline"
                  >
                    Apply
                  </Button>
                  {couponAppliedError && (
                    <p className="text-sm text-red-600">{couponAppliedError}</p>
                  )}
                  {appliedCoupon && (
                    <p className="text-sm text-green-600">
                      Coupon Applied Successfully!
                    </p>
                  )}
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
