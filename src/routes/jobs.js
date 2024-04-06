const { Router } = require('express');
const router = Router();
const { getUnpaidJobs } = require('../controllers/jobsController');

router.get('/unpaid', getUnpaidJobs);

module.exports = {
  jobs: router,
};
