// Note: This would be used in a Node.js environment
// For demonstration purposes in our web environment

const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('../database/db');

const loadOrders = () => {
  return new Promise((resolve, reject) => {
    const orders = [];
    
    fs.createReadStream('./src/data/sampleOrders.csv')
      .pipe(csv())
      .on('data', (row) => {
        orders.push(row);
        
        // Insert into database
        db.run(
          `INSERT OR REPLACE INTO orders (id, user_id, amount, product, created_at) VALUES (?, ?, ?, ?, ?)`,
          [row.id, row.user_id, parseFloat(row.amount), row.product, row.created_at],
          (err) => {
            if (err) {
              console.error('Error inserting order:', err);
            }
          }
        );
      })
      .on('end', () => {
        console.log(`Loaded ${orders.length} orders successfully`);
        resolve(orders);
      })
      .on('error', (err) => {
        console.error('Error loading orders CSV:', err);
        reject(err);
      });
  });
};

module.exports = { loadOrders };