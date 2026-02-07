const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class Politician {
  constructor() {
    this.filePath = path.join(__dirname, '../data/politicians.csv');
  }

  //get all politicians
  async getAll() {
    return new Promise((resolve, reject) => {
      const politicians = [];
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
        return;
      }
      
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (row) => {
          politicians.push(row);
        })
        .on('end', () => {
          resolve(politicians);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  //find politician by id
  async getById(id) {
    const politicians = await this.getAll();
    return politicians.find(p => p.id === id);
  }

  //add new politician
  async create(politician) {
    const politicians = await this.getAll();
    politicians.push(politician);
    return this.saveAll(politicians);
  }

  //save all politicians
  async saveAll(politicians) {
    const csvWriter = createCsvWriter({
      path: this.filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'name', title: 'name' },
        { id: 'party', title: 'party' }
      ]
    });

    return csvWriter.writeRecords(politicians);
  }
}

module.exports = new Politician();
