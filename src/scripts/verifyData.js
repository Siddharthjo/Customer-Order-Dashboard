// Data verification script for Node.js environment
// This would be run to verify the data was loaded correctly

const { db } = require('../database/db');

const verifyData = async () => {
  try {
    console.log('=== DATA VERIFICATION ===\n');
    
    // Check users table
    const users = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM users LIMIT 5", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('Sample Users:');
    console.table(users);
    
    // Check orders table
    const orders = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM orders LIMIT 5", [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('\nSample Orders:');
    console.table(orders);
    
    // Get user count
    const userCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    // Get order count
    const orderCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM orders", [], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });
    
    console.log(`\n=== SUMMARY ===`);
    console.log(`Total Users: ${userCount}`);
    console.log(`Total Orders: ${orderCount}`);
    
    // Test JOIN query
    const joinQuery = `
      SELECT o.id, o.amount, o.product, u.name, u.email, o.created_at
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LIMIT 3
    `;
    
    const joinResults = await new Promise((resolve, reject) => {
      db.all(joinQuery, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('\nSample JOIN Results:');
    console.table(joinResults);
    
  } catch (error) {
    console.error('Verification failed:', error);
  }
};

module.exports = { verifyData };

// Run verification if this file is executed directly
if (require.main === module) {
  verifyData();
}