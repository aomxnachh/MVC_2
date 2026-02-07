const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class Campaign {
  constructor() {
    this.filePath = path.join(__dirname, '../data/campaigns.csv');
  }

  //get all campaigns
  async getAll() {
    return new Promise((resolve, reject) => {
      const campaigns = [];
      if (!fs.existsSync(this.filePath)) {
        resolve([]);
        return;
      }
      
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on('data', (row) => {
          campaigns.push(row);
        })
        .on('end', () => {
          resolve(campaigns);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  //find by id
  async getById(id) {
    const campaigns = await this.getAll();
    return campaigns.find(c => c.id === id);
  }

  //add new campaign
  async create(campaign) {
    const campaigns = await this.getAll();
    campaigns.push(campaign);
    return this.saveAll(campaigns);
  }

  //save to csv
  async saveAll(campaigns) {
    const csvWriter = createCsvWriter({
      path: this.filePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'year', title: 'year' },
        { id: 'district', title: 'district' }
      ]
    });

    return csvWriter.writeRecords(campaigns);
  }
}

module.exports = new Campaign();
