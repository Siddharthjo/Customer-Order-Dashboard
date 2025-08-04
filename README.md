# Customer Order Dashboard with RESTful API

A comprehensive customer order management system with a React frontend and Express.js API backend.

## 🚀 Features

### Frontend Dashboard
- **Customer Analytics**: Real-time metrics and insights
- **Order Management**: Comprehensive order tracking and analysis
- **Responsive Design**: Works seamlessly across all devices
- **Interactive Charts**: Revenue trends and product performance
- **Advanced Filtering**: Search, sort, and paginate through data

### RESTful API
- **Customer Endpoints**: Full CRUD operations for customer data
- **Order Statistics**: Integrated order analytics per customer
- **Pagination Support**: Efficient data loading with page/limit controls
- **Search & Filtering**: Query customers by name or email
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

## 📋 API Endpoints

### Customers
- `GET /api/customers` - Get all customers with pagination
  - Query params: `page`, `limit`, `search`, `sort`, `order`
- `GET /api/customers/:id` - Get customer by ID with order statistics
- `GET /api/customers/:id/orders` - Get all orders for a customer

### Health Check
- `GET /api/health` - API health status

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Supabase** for database operations
- **CORS** enabled for cross-origin requests
- **Comprehensive error handling**

## 🚦 Getting Started

### Prerequisites
1. Node.js 18+ installed
2. Supabase project set up
3. Environment variables configured

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   PORT=3001
   ```

3. **Start the development servers**:
   
   **Frontend** (Terminal 1):
   ```bash
   npm run dev
   ```
   
   **API Backend** (Terminal 2):
   ```bash
   npm run dev:api
   ```

4. **Test the API**:
   ```bash
   npm run test:api
   ```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  amount REAL,
  product TEXT,
  created_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 API Testing

The project includes comprehensive API testing:

```bash
# Run all API tests
npm run test:api

# Test individual endpoints
curl http://localhost:3001/api/health
curl http://localhost:3001/api/customers
curl http://localhost:3001/api/customers/1
```

## 📱 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully",
  "pagination": { /* pagination info for list endpoints */ }
}
```

### Error Responses
- **400 Bad Request**: Invalid parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

## 🔧 Development

### Project Structure
```
├── backend/
│   ├── config/          # Database configuration
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utility functions
│   └── scripts/         # Testing and utility scripts
├── src/
│   ├── components/      # React components
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Frontend utilities
│   └── data/            # Sample data files
└── supabase/
    └── migrations/      # Database migrations
```

### Key Features
- **Type Safety**: Full TypeScript support across frontend and backend
- **Error Handling**: Comprehensive error management with proper HTTP status codes
- **Pagination**: Efficient data loading with customizable page sizes
- **Search**: Real-time search across customer names and emails
- **Sorting**: Multi-column sorting with ascending/descending options
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🎯 Milestone Completion

✅ **Milestone 1**: Database Design and CSV Loading
- SQLite schema with proper relationships
- CSV data loading utilities
- Sample data generation

✅ **Milestone 2**: Customer API
- RESTful endpoints with proper HTTP methods
- Pagination and search functionality
- Error handling with appropriate status codes
- Customer order statistics integration
- Comprehensive API testing suite

## 📈 Next Steps

- Add authentication and authorization
- Implement order management endpoints
- Add data validation and sanitization
- Set up automated testing pipeline
- Deploy to production environment