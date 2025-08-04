import React from 'react';
import { OrderAnalytics } from '../types';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';

interface MetricsCardsProps {
  analytics: OrderAnalytics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ analytics }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'bg-blue-500',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'bg-emerald-500',
      change: '+8.2%'
    },
    {
      title: 'Average Order Value',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      change: '+4.1%'
    },
    {
      title: 'Top Product Sales',
      value: analytics.topProducts[0]?.count || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15.3%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {metric.value}
                </p>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`${metric.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};