const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class PoliticianPromise {
  constructor() {
    this.filePath = path.join(__dirname, '../data/promises.csv');
  }

  //get all promises
  async getAll() {
    return new Promise((resolve, reject) => {
      const promises = [];
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
        return;
      }
      
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (row) => {
          promises.push(row);
        })
        .on('end', () => {
          resolve(promises);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  //find promise by id
  async getById(id) {
    const promises = await this.getAll();
    return promises.find(p => p.id === id);
  }

  //find promises by politicianId
  async getByPoliticianId(politicianId) {
    const promises = await this.getAll();
    return promises.filter(p => p.politicianId === politicianId);
  }

  //add new promise
  async create(promise) {
    const promises = await this.getAll();
    promises.push(promise);
    return this.saveAll(promises);
  }

  //update promise status
  async updateStatus(id, status) {
    const promises = await this.getAll();
    const promise = promises.find(p => p.id === id);
    if (promise) {
      promise.status = status;
      return this.saveAll(promises);
    }
    return false;
  }

  //sort by announced date (new -> old)
  async getAllSortedByDate() {
    const promises = await this.getAll();
    return promises.sort((a, b) => {
      return new Date(b.announcedDate) - new Date(a.announcedDate);
    });
  }

  //save all promises
  async saveAll(promises) {
    const csvWriter = createCsvWriter({
      path: this.filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'politicianId', title: 'politicianId' },
        { id: 'description', title: 'description' },
        { id: 'announcedDate', title: 'announcedDate' },
        { id: 'status', title: 'status' }
      ]
    });

    return csvWriter.writeRecords(promises);
  }
}

module.exports = new PoliticianPromise();
