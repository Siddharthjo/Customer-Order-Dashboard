import React, { useState, useEffect } from 'react';
import { User, Order, OrderAnalytics } from '../types';
import { loadSampleData } from '../utils/csvLoader';
import { calculateAnalytics } from '../utils/analytics';
import { MetricsCards } from './MetricsCards';
import { OrdersTable } from './OrdersTable';
import { TopProducts } from './TopProducts';
import { RevenueChart } from './RevenueChart';
import { LoadingSpinner } from './LoadingSpinner';

export const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<OrderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { users, orders } = await loadSampleData();
        setUsers(users);
        setOrders(orders);
        
        const analyticsData = calculateAnalytics(users, orders);
        setAnalytics(analyticsData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-600 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Order Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track orders, analyze customer data, and monitor business performance
          </p>
        </div>

        <div className="space-y-8">
          <MetricsCards analytics={analytics} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RevenueChart data={analytics.monthlyRevenue} />
            <TopProducts products={analytics.topProducts} />
          </div>
          
          <OrdersTable orders={analytics.recentOrders} />
        </div>
      </div>
    </div>
  );
};