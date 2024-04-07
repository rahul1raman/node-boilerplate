const { sequelize } = require('../model');
const JobsReader = require('../readers/jobsReader');
const { updateBalances, updateJobPaymentStatus } = require('../services/jobsService');

/**
 * Get all active unpaid jobs for a user
 * @returns jobs
 */
async function getUnpaidJobs(req, res, next) {
  try {
    const { Job, Contract } = req.app.get('models');
    const profileId = req.profile.id;
    const jobsReader = new JobsReader(Job, Contract);
    const jobs = await jobsReader.fetchUnpaidJobs(profileId);
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

/**
 * Pay for a job, a client can only pay if client's balance >= the amount to pay
 *
 * @returns Success | error
 */
async function payForJob(req, res, next) {
  try {
    const { Job, Contract, Profile } = req.app.get('models');
    const jobId = req.params.job_id;
    const client = req.profile;

    const jobsReader = new JobsReader(Job, Contract);
    const job = await jobsReader.findJobByIdForClient(client.id, jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found!' });
    }

    if (job.paid) {
      return res.status(400).json({ message: 'Job has already been paid for' });
    }

    if (client.balance < job.price) {
      return res.status(400).json({ message: 'Insufficient balance to pay for the job' });
    }

    await sequelize.transaction(async (transaction) => {
      await updateBalances({ client, job, transaction, Profile });
      await updateJobPaymentStatus(job, transaction);
    });

    res.json({ message: `Payment successful for job: ${jobId}` });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUnpaidJobs,
  payForJob,
};
