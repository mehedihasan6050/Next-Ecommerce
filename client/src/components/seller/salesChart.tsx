'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const salesData = [
  { name: '5k', value: 20 },
  { name: '10k', value: 32 },
  { name: '15k', value: 45 },
  { name: '20k', value: 52 },
  { name: '25k', value: 38 },
  { name: '30k', value: 55 },
  { name: '35k', value: 42 },
  { name: '40k', value: 48 },
  { name: '45k', value: 65 },
  { name: '50k', value: 58 },
  { name: '55k', value: 42 },
  { name: '60k', value: 55 },
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Peak data point for the tooltip
const peakData = [
  { name: '5k', value: 20 },
  { name: '10k', value: 32 },
  { name: '15k', value: 45 },
  { name: '20k', value: 52 },
  { name: '25k', value: 100 }, // Peak point
  { name: '30k', value: 55 },
  { name: '35k', value: 42 },
  { name: '40k', value: 48 },
  { name: '45k', value: 65 },
  { name: '50k', value: 58 },
  { name: '55k', value: 42 },
  { name: '60k', value: 55 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    if (value === 100) {
      return (
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
          64,3664.77
        </div>
      );
    }
  }
  return null;
};

function SalesChart() {
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Sales Details
        </CardTitle>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={peakData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                domain={[0, 120]}
                tickFormatter={value => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
export default SalesChart;
