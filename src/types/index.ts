export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  amount: number;
  product: string;
  created_at: string;
  userName?: string;
  userEmail?: string;
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{ product: string; count: number; revenue: number }>;
  recentOrders: Order[];
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}