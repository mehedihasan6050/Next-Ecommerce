import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  Package,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const metrics = [
  {
    title: 'Total Customer',
    value: '40,689',
    change: '8.5% Up from yesterday',
    trend: 'up',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Total Order',
    value: '10293',
    change: '1.3% Up from past week',
    trend: 'up',
    icon: Package,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Total Sales',
    value: '$89,000',
    change: '4.3% Down from yesterday',
    trend: 'down',
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Pending Order',
    value: '2040',
    change: '1.8% Up from yesterday',
    trend: 'up',
    icon: Clock,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
];

 function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map(metric => (
        <Card key={metric.title} className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </p>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-full ${metric.iconBg} flex items-center justify-center`}
              >
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
export default MetricsCards