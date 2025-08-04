import { supabase } from '../config/supabase';
import { Customer, CustomerWithStats, PaginationParams, QueryParams } from '../types/api';

export class CustomerService {
  /**
   * Get all customers with pagination and optional search/sorting
   */
  static async getAllCustomers(params: QueryParams) {
    const page = Math.max(1, parseInt(params.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(params.limit || '10')));
    const offset = (page - 1) * limit;
    const search = params.search?.trim();
    const sort = params.sort || 'created_at';
    const order = params.order === 'asc' ? 'asc' : 'desc';

    try {
      // Build the base query
      let query = supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          created_at,
          orders!inner(count)
        `, { count: 'exact' });

      // Add search filter if provided
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Add sorting
      query = query.order(sort, { ascending: order === 'asc' });

      // Add pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      // Get order statistics for each customer
      const customersWithStats = await Promise.all(
        (data || []).map(async (customer: any) => {
          const stats = await this.getCustomerOrderStats(customer.id);
          return {
            ...customer,
            ...stats
          };
        })
      );

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        customers: customersWithStats,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get a single customer by ID with order statistics
   */
  static async getCustomerById(id: number): Promise<CustomerWithStats | null> {
    try {
      // Validate ID
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error('Invalid customer ID');
      }

      // Get customer basic info
      const { data: customer, error } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Customer not found
        }
        throw new Error(`Database query failed: ${error.message}`);
      }

      // Get order statistics
      const orderStats = await this.getCustomerOrderStats(id);

      return {
        ...customer,
        ...orderStats
      };
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get order statistics for a specific customer
   */
  private static async getCustomerOrderStats(customerId: number) {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('amount, created_at')
        .eq('user_id', customerId);

      if (error) {
        throw new Error(`Failed to fetch order stats: ${error.message}`);
      }

      const orderCount = orders?.length || 0;
      const totalSpent = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
      const lastOrderDate = orders?.length > 0 
        ? orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at
        : null;

      return {
        order_count: orderCount,
        total_spent: Math.round(totalSpent * 100) / 100, // Round to 2 decimal places
        last_order_date: lastOrderDate
      };
    } catch (error) {
      console.error(`Error fetching order stats for customer ${customerId}:`, error);
      return {
        order_count: 0,
        total_spent: 0,
        last_order_date: null
      };
    }
  }

  /**
   * Check if a customer exists
   */
  static async customerExists(id: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .single();

      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}