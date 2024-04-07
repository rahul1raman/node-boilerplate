const ProfileService = require('../services/profileService');

async function deposit(req, res, next) {
  try {
    const { Contract, Job, Profile } = req.app.get('models');
    const userId = req.params.userId;
    const amount = parseFloat(req.body.amount);
    const profile = req.profile;

    const profileService = new ProfileService(Profile, Job, Contract);
    const updatedBalance = await profileService.deposit(amount, userId, profile);

    res.json({ message: 'Transaction Complete', updatedBalance });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  deposit,
};
