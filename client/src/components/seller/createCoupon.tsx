'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useCouponStore } from '@/store/useCouponStore';
import { useState } from 'react';
import { X } from 'lucide-react';
import { protectCouponFormAction } from '@/action/coupon';
import { useAuthStore } from '@/store/useAuthStore';

interface UpdateProductModalProps {
  onClose: () => void;
}

function CreateCouponModal({ onClose }: UpdateProductModalProps) {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: 0,
    startDate: '',
    endDate: '',
    usageLimit: 0,
  });

  const { createCoupon, isLoading, fetchCoupons } = useCouponStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateUniqueCoupon = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setFormData(prev => ({
      ...prev,
      code: result,
    }));
  };

  const handleCouponSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      return toast.error('please login first');
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast('End date must be after start date');

      return;
    }

    const checkCouponFormvalidation = await protectCouponFormAction();
    if (!checkCouponFormvalidation.success) {
      toast(checkCouponFormvalidation.error);
      return;
    }

    const couponData = {
      ...formData,
      discountPercent: parseFloat(formData.discountPercent.toString()),
      usageLimit: parseInt(formData.usageLimit.toString()),
      sellerId: user.id,
    };

    const result = await createCoupon(couponData);
    if (result) {
      toast('Coupon added successfully');
      fetchCoupons();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Coupon</h2>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleCouponSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={formData.startDate}
                onChange={handleInputChange}
                name="startDate"
                type="date"
                className="mt-1.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={formData.endDate}
                onChange={handleInputChange}
                name="endDate"
                type="date"
                className="mt-1.5"
                required
              />
            </div>
          </div>
          <div>
            <Label>Coupon Code</Label>
            <div className="flex justify-between items-center gap-2">
              <Input
                type="text"
                name="code"
                placeholder="Enter coupon code"
                className="mt-1.5"
                required
                value={formData.code}
                onChange={handleInputChange}
              />
              <Button type="button" onClick={handleCreateUniqueCoupon}>
                Create Unique Code
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                name="discountPercent"
                placeholder="Enter discount percentage"
                className="mt-1.5"
                required
                value={formData.discountPercent}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Usage Limits</Label>
              <Input
                type="number"
                name="usageLimit"
                placeholder="Enter usage limits"
                className="mt-1.5"
                required
                value={formData.usageLimit}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full cursor-pointer"
          >
            {isLoading ? 'creating...' : 'Create'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateCouponModal;
