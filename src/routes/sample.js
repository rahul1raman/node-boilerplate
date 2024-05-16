const { Router } = require('express');
const router = Router();
const { knockKnock } = require('../controllers/sampleController');

router.get('/knock-knock', knockKnock);

module.exports = {
  sample: router,
};
