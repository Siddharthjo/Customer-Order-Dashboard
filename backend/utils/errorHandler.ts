import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/api';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.message.includes('Invalid customer ID')) {
    statusCode = 400;
    message = error.message;
  } else if (error.message.includes('not found')) {
    statusCode = 404;
    message = error.message;
  } else if (error.message.includes('Database query failed')) {
    statusCode = 500;
    message = 'Database operation failed';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const response: ApiResponse = {
    success: false,
    data: null,
    message: message
  };

  // Add error details in development
  if (process.env.NODE_ENV === 'development') {
    response.data = {
      error: error.message,
      stack: error.stack
    };
  }

  res.status(statusCode).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};