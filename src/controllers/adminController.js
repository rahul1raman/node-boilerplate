const AdminReader = require('../readers/adminReader');

/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contactor that worked in the query time range
 */
async function findBestProfession(req, res, next) {
  try {
    const { Job, Profile, Contract } = req.app.get('models');
    const { start, end } = req.query;

    const adminReader = new AdminReader(Job, Profile, Contract);
    const result = await adminReader.getBestProfession(start, end);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Returns the clients who paid the most
 * for jobs in the query time period
 */
async function findBestClients(req, res, next) {}

module.exports = {
  findBestProfession,
  findBestClients,
};
