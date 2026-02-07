const PoliticianPromise = require('../models/Promise');
const PromiseUpdate = require('../models/PromiseUpdate');
const Politician = require('../models/Politician');

class PromiseController {
  //show all promises(sorted by date)
  async listAllPromises(req, res) {
    try {
      const promises = await PoliticianPromise.getAllSortedByDate();
      const politicians = await Politician.getAll();
      
      //link politicians data with promises
      const promisesWithPoliticians = promises.map(promise => {
        const politician = politicians.find(p => p.id === promise.politicianId);
        return {
          ...promise,
          politicianName: politician ? politician.name : 'ไม่ทราบชื่อ',
          politicianParty: politician ? politician.party : 'ไม่ทราบพรรค'
        };
      });

      res.render('allPromises', { 
        promises: promisesWithPoliticians,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Error fetching promises:', error);
      res.status(500).send('Error loading data');
    }
  }

  //show promise detail
  async showPromiseDetail(req, res) {
    try {
      const promiseId = req.params.id;
      const promise = await PoliticianPromise.getById(promiseId);
      
      if (!promise) {
        return res.status(404).send('ไม่พบคำสัญญา');
      }

      const politician = await Politician.getById(promise.politicianId);
      const updates = await PromiseUpdate.getByPromiseId(promiseId);

      //check if user can update this promise
      const canUpdate = req.session.user.role === 'admin' || 
                       req.session.user.politicianId === promise.politicianId;

      res.render('promiseDetail', { 
        promise,
        politician,
        updates,
        user: req.session.user,
        canUpdate: canUpdate
      });
    } catch (error) {
      console.error('Error fetching promise details:', error);
      res.status(500).send('Error loading data');
    }
  }

  //show update form
  async showUpdateForm(req, res) {
    try {
      const promiseId = req.params.id;
      const promise = await PoliticianPromise.getById(promiseId);
      
      if (!promise) {
        return res.status(404).send('ไม่พบคำสัญญา');
      }

      //check permission
      if (req.session.user.role !== 'admin' && 
          req.session.user.politicianId !== promise.politicianId) {
        return res.send(`
          <script>
            alert('You do not have permission to update this promise');
            window.location.href = '/promises/${promiseId}';
          </script>
        `);
      }

      //ถ้าสัญญามี status เงียบหาย จะไม่สามารถอัปเดตได้
      if (promise.status === 'เงียบหาย') {
        return res.send(`
          <script>
            alert('ไม่สามารถอัปเดตคำสัญญาที่มีสถานะ "เงียบหาย" ได้');
            window.location.href = '/promises/${promiseId}';
          </script>
        `);
      }

      const politician = await Politician.getById(promise.politicianId);

      res.render('updatePromise', { 
        promise,
        politician,
        user: req.session.user 
      });
    } catch (error) {
      console.error('Error showing update form:', error);
      res.status(500).send('Error loading data');
    }
  }

  //save update progress
  async submitUpdate(req, res) {
    try {
      const promiseId = req.params.id;
      const { description, status } = req.body;

      const promise = await PoliticianPromise.getById(promiseId);
      
      if (!promise) {
        return res.status(404).send('ไม่พบคำสัญญา');
      }

      //check permission
      if (req.session.user.role !== 'admin' && 
          req.session.user.politicianId !== promise.politicianId) {
        return res.status(403).send('You do not have permission to update this promise');
      }

      //Business Rule: คำสัญญาที่มีสถานะ "เงียบหาย" ไม่สามารถอัปเดตได้
      if (promise.status === 'เงียบหาย') {
        return res.send(`
          <script>
            alert('ไม่สามารถอัปเดตคำสัญญาที่มีสถานะ "เงียบหาย" ได้');
            window.location.href = '/promises/${promiseId}';
          </script>
        `);
      }

      //create new update id
      const allUpdates = await PromiseUpdate.getAll();
      const newUpdateId = 'U' + String(allUpdates.length + 1).padStart(5, '0');

      //save update
      const update = {
        id: newUpdateId,
        promiseId: promiseId,
        updateDate: new Date().toISOString().split('T')[0],
        description: description
      };

      await PromiseUpdate.create(update);

      //update promise status (ถ้ามีการเปลี่ยนแปลง)
      if (status && status !== promise.status) {
        await PoliticianPromise.updateStatus(promiseId, status);
      }

      //Business Rule: เมื่ออัปเดตแล้วต้องกลับไปหน้ารายละเอียดคำสัญญา
      res.redirect(`/promises/${promiseId}`);
    } catch (error) {
      console.error('Error submitting update:', error);
      res.status(500).send('Error saving data');
    }
  }
}

module.exports = new PromiseController();
