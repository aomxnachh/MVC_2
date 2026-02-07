const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class User {
  constructor() {
    this.filePath = path.join(__dirname, '../data/users.csv');
  }

  // get all users
  async getAll() {
    return new Promise((resolve, reject) => {
      const users = [];
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
        return;
      }
      
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (row) => {
          users.push(row);
        })
        .on('end', () => {
          resolve(users);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  // find user by username
  async findByUsername(username) {
    const users = await this.getAll();
    return users.find(u => u.username === username);
  }

  // check login
  async authenticate(username, password) {
    const user = await this.findByUsername(username);
    if (user && user.password === password) {
      return {
        username: user.username,
        role: user.role,
        politicianId: user.politicianId || null
      };
    }
    return null;
  }
}

module.exports = new User();
