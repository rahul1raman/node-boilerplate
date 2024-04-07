const { Router } = require('express');
const router = Router();
const { deposit } = require('../controllers/balancesController');

router.post('/deposit/:userId', deposit);

module.exports = {
  balances: router,
};
