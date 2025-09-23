'use client';

import AddProductModal from '@/components/seller/addProduct';
import CreateCouponModal from '@/components/seller/createCoupon';
import MetricsCards from '@/components/seller/metricsCards';
import SalesChart from '@/components/seller/salesChart';
import { Button } from '@/components/ui/button';
import { useCouponStore } from '@/store/useCouponStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useProductStore } from '@/store/useProductStore';
import React, { useEffect } from 'react';

const DashBoard = () => {
  const { setAddOpen, isAddOpen } = useProductStore();
  const { setCreateOpen, createOpen } = useCouponStore();
  const { statisticsSeller, dashBoardStatistics, isLoading } =
    useDashboardStore();

  useEffect(() => {
    dashBoardStatistics();
  }, []);

  console.log(statisticsSeller);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="lg:text-2xl text-base font-semibold text-foreground mb-0 lg:mb-6">
          Dashboard
        </h1>{' '}
        <div className="space-x-3">
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-blue-500 text-white cursor-pointer lg:text-base text-xs"
          >
            Add New Product
          </Button>
          {isAddOpen && <AddProductModal onClose={() => setAddOpen(false)} />}
          <Button
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer lg:text-base text-xs"
          >
            Create Coupon
          </Button>
          {createOpen && (
            <CreateCouponModal onClose={() => setCreateOpen(false)} />
          )}
        </div>
      </div>
      <MetricsCards statistics={statisticsSeller} />
      {/* demo */}
      <SalesChart />
    </div>
  );
};

export default DashBoard;
