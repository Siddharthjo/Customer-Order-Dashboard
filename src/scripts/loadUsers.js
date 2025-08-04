// Note: This would be used in a Node.js environment
// For demonstration purposes in our web environment

const fs = require('fs');
const csv = require('csv-parser');
const { db } = require('../database/db');

const loadUsers = () => {
  return new Promise((resolve, reject) => {
    const users = [];
    
    fs.createReadStream('./src/data/sampleUsers.csv')
      .pipe(csv())
      .on('data', (row) => {
        users.push(row);
        
        // Insert into database
        db.run(
          `INSERT OR REPLACE INTO users (id, name, email, created_at) VALUES (?, ?, ?, ?)`,
          [row.id, row.name, row.email, row.created_at],
          (err) => {
            if (err) {
              console.error('Error inserting user:', err);
            }
          }
        );
      })
      .on('end', () => {
        console.log(`Loaded ${users.length} users successfully`);
        resolve(users);
      })
      .on('error', (err) => {
        console.error('Error loading users CSV:', err);
        reject(err);
      });
  });
};

module.exports = { loadUsers };