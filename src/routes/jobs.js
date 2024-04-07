const { Router } = require('express');
const router = Router();
const { getUnpaidJobs, payForJob } = require('../controllers/jobsController');

router.get('/unpaid', getUnpaidJobs);
router.post('/:job_id/pay', payForJob);

module.exports = {
  jobs: router,
};
