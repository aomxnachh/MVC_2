const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class PromiseUpdate {
  constructor() {
    this.filePath = path.join(__dirname, '../data/promiseUpdates.csv');
  }

  //get all updates
  async getAll() {
    return new Promise((resolve, reject) => {
      const updates = [];
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
        return;
      }
      
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (row) => {
          updates.push(row);
        })
        .on('end', () => {
          resolve(updates);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  //get updates for promise
  async getByPromiseId(promiseId) {
    const updates = await this.getAll();
    const filtered = updates.filter(u => u.promiseId === promiseId);
    // sort newest first
    return filtered.sort((a, b) => {
      return new Date(b.updateDate) - new Date(a.updateDate);
    });
  }

  //add new update
  async create(update) {
    const updates = await this.getAll();
    updates.push(update);
    return this.saveAll(updates);
  }

  //save to csv
  async saveAll(updates) {
    const csvWriter = createCsvWriter({
      path: this.filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'promiseId', title: 'promiseId' },
        { id: 'updateDate', title: 'updateDate' },
        { id: 'description', title: 'description' }
      ]
    });

    return csvWriter.writeRecords(updates);
  }
}

module.exports = new PromiseUpdate();
