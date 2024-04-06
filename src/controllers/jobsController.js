const { fetchUnpaidJobs } = require('../readers/jobsReader');

/**
 * Get all active unpaid jobs for a user
 * @returns jobs
 */
async function getUnpaidJobs(req, res) {
  try {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;
    const jobs = await fetchUnpaidJobs(Job, Contract, profileId);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong!',
      error: err.message,
    });
  }
}

module.exports = {
  getUnpaidJobs,
};
