import { Router, Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customerService';
import { ApiResponse, QueryParams } from '../types/api';

const router = Router();

/**
 * GET /customers
 * Returns a list of all customers with pagination
 * Query params: page, limit, search, sort, order
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams: QueryParams = {
      page: req.query.page as string,
      limit: req.query.limit as string,
      search: req.query.search as string,
      sort: req.query.sort as 'name' | 'email' | 'created_at' | 'order_count',
      order: req.query.order as 'asc' | 'desc'
    };

    const result = await CustomerService.getAllCustomers(queryParams);

    const response: ApiResponse = {
      success: true,
      data: result.customers,
      message: `Retrieved ${result.customers.length} customers`,
      pagination: result.pagination
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /customers/:id
 * Returns customer details by ID with order statistics
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    // Validate ID parameter
    if (isNaN(id) || id <= 0) {
      const response: ApiResponse = {
        success: false,
        data: null,
        message: 'Invalid customer ID. ID must be a positive integer.'
      };
      return res.status(400).json(response);
    }

    const customer = await CustomerService.getCustomerById(id);

    if (!customer) {
      const response: ApiResponse = {
        success: false,
        data: null,
        message: `Customer with ID ${id} not found`
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: customer,
      message: `Customer ${id} retrieved successfully`
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /customers/:id/orders
 * Returns all orders for a specific customer
 */
router.get('/:id/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
      const response: ApiResponse = {
        success: false,
        data: null,
        message: 'Invalid customer ID. ID must be a positive integer.'
      };
      return res.status(400).json(response);
    }

    // Check if customer exists
    const customerExists = await CustomerService.customerExists(id);
    if (!customerExists) {
      const response: ApiResponse = {
        success: false,
        data: null,
        message: `Customer with ID ${id} not found`
      };
      return res.status(404).json(response);
    }

    // Get customer orders (this would be implemented in CustomerService)
    // For now, return a placeholder response
    const response: ApiResponse = {
      success: true,
      data: [],
      message: `Orders for customer ${id} retrieved successfully`
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;