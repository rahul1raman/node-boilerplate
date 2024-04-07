const { Router } = require('express');
const router = Router();
const { findBestProfession, findBestClients } = require('../controllers/adminController');

router.get('/best-profession', findBestProfession);
router.get('/best-clients', findBestClients);

module.exports = {
  admin: router,
};
