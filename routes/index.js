const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const promiseController = require('../controllers/promiseController');
const politicianController = require('../controllers/politicianController');
const { requireAuth } = require('../middleware/auth');

//Authentication Routes
router.get('/', authController.showLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//Promise Routes (ต้อง login ก่อน)
router.get('/promises', requireAuth, promiseController.listAllPromises);
router.get('/promises/:id', requireAuth, promiseController.showPromiseDetail);
router.get('/promises/:id/update', requireAuth, promiseController.showUpdateForm);
router.post('/promises/:id/update', requireAuth, promiseController.submitUpdate);

//Politician Routes (ต้อง login ก่อน)
router.get('/politicians', requireAuth, politicianController.listPoliticians);
router.get('/politicians/:id', requireAuth, politicianController.showPolitician);

module.exports = router;
