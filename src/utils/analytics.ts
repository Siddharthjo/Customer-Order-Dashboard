import { User, Order, OrderAnalytics } from '../types';
import { format, parseISO, startOfMonth } from 'date-fns';

export const calculateAnalytics = (users: User[], orders: Order[]): OrderAnalytics => {
  // Join orders with user data
  const ordersWithUsers = orders.map(order => {
    const user = users.find(u => u.id === order.user_id);
    return {
      ...order,
      userName: user?.name || 'Unknown',
      userEmail: user?.email || 'Unknown'
    };
  });

  // Calculate basic metrics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const averageOrderValue = totalRevenue / totalOrders;

  // Calculate top products
  const productMap = new Map<string, { count: number; revenue: number }>();
  
  orders.forEach(order => {
    const existing = productMap.get(order.product) || { count: 0, revenue: 0 };
    productMap.set(order.product, {
      count: existing.count + 1,
      revenue: existing.revenue + order.amount
    });
  });

  const topProducts = Array.from(productMap.entries())
    .map(([product, data]) => ({ product, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Calculate monthly revenue
  const monthlyMap = new Map<string, number>();
  
  orders.forEach(order => {
    const month = format(startOfMonth(parseISO(order.created_at)), 'MMM yyyy');
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + order.amount);
  });

  const monthlyRevenue = Array.from(monthlyMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Get recent orders
  const recentOrders = ordersWithUsers
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10);

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    topProducts,
    recentOrders,
    monthlyRevenue
  };
};