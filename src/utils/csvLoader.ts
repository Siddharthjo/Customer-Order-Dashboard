import { User, Order } from '../types';

// CSV parsing utility
export const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.trim().split('\n');
  return lines.map(line => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  });
};

// Load users from CSV content
export const loadUsersFromCSV = (csvContent: string): User[] => {
  const rows = parseCSV(csvContent);
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => ({
    id: parseInt(row[0]),
    name: row[1],
    email: row[2],
    created_at: row[3]
  }));
};

// Load orders from CSV content
export const loadOrdersFromCSV = (csvContent: string): Order[] => {
  const rows = parseCSV(csvContent);
  const headers = rows[0];
  const dataRows = rows.slice(1);
  
  return dataRows.map(row => ({
    id: parseInt(row[0]),
    user_id: parseInt(row[1]),
    amount: parseFloat(row[2]),
    product: row[3],
    created_at: row[4]
  }));
};

// Simulate loading CSV files (in a real environment, you'd read from filesystem)
export const loadSampleData = async (): Promise<{ users: User[], orders: Order[] }> => {
  // In a real Node.js environment, you would use fs.readFileSync or fs.createReadStream
  const usersCSV = `id,name,email,created_at
1,John Smith,john.smith@email.com,2024-01-15T10:30:00Z
2,Sarah Johnson,sarah.johnson@email.com,2024-01-16T14:20:00Z
3,Michael Brown,michael.brown@email.com,2024-01-17T09:15:00Z
4,Emily Davis,emily.davis@email.com,2024-01-18T16:45:00Z
5,David Wilson,david.wilson@email.com,2024-01-19T11:30:00Z`;

  const ordersCSV = `id,user_id,amount,product,created_at
1,1,299.99,Wireless Headphones,2024-01-15T11:00:00Z
2,2,149.99,Bluetooth Speaker,2024-01-16T14:30:00Z
3,1,79.99,Phone Case,2024-01-17T09:45:00Z
4,3,499.99,Laptop Stand,2024-01-17T10:15:00Z
5,4,199.99,Mechanical Keyboard,2024-01-18T17:00:00Z`;

  const users = loadUsersFromCSV(usersCSV);
  const orders = loadOrdersFromCSV(ordersCSV);

  return { users, orders };
};