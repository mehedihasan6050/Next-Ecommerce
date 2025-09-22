'use client';

import CreateCouponModal from '@/components/seller/createCoupon';
import MetricsCards from '@/components/admin/metricsCards';
import SalesChart from '@/components/seller/salesChart';
import { Button } from '@/components/ui/button';
import { useDashboardStore } from '@/store/useDashboardStore';
import React, { useEffect } from 'react';

const DashBoard = () => {
  const { statisticsAdmin, dashboardStatsForAdmin, isLoading } =
    useDashboardStore();

  useEffect(() => {
    dashboardStatsForAdmin();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Dashboard
        </h1>{' '}
      </div>
      <MetricsCards statistics={statisticsAdmin} />
      {/* demo */}
      <SalesChart />
    </div>
  );
};

export default DashBoard;
