import MetricsCards from '@/components/admin/metricsCards';
import SalesChart from '@/components/admin/salesChart';
import { Button } from '@/components/ui/button';
import React from 'react';

const DashBoard = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Dashboard
        </h1>{' '}
        <div className="space-x-3">
          <Button className="bg-blue-500 text-white cursor-pointer">
            Add New Product
          </Button>
          <Button className="cursor-pointer">Create Coupon</Button>
        </div>
      </div>
      <MetricsCards />
      <SalesChart />
    </div>
  );
};

export default DashBoard;
