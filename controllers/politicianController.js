const Politician = require('../models/Politician');
const PoliticianPromise = require('../models/Promise');

class PoliticianController {
  //show list of politicians
  async listPoliticians(req, res) {
    try {
      const politicians = await Politician.getAll();
      res.render('politicianList', { 
        politicians,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Error fetching politicians:', error);
      res.status(500).send('Error loading data');
    }
  }

  //show promises of a specific politician
  async showPolitician(req, res) {
    try {
      const politicianId = req.params.id;
      const politician = await Politician.getById(politicianId);
      
      if (!politician) {
        return res.status(404).send('Politician not found');
      }

      const promises = await PoliticianPromise.getByPoliticianId(politicianId);
      
      res.render('politician', { 
        politician,
        promises,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Error fetching politician details:', error);
      res.status(500).send('Error loading data');
    }
  }
}

module.exports = new PoliticianController();
