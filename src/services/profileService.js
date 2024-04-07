const { PROFILE_TYPE } = require('../constants');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { sequelize } = require('../model');
const JobsReader = require('../readers/jobsReader');

class ProfileService {
  constructor(Profile, Job, Contract) {
    this.Profile = Profile;
    this.Job = Job;
    this.Contract = Contract;
  }

  async deposit(amount, userId, profile) {
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestError('Invalid deposit amount');
    }

    if (profile?.id !== userId) {
      throw new UnauthorizedError('User id not the same as profile');
    }

    if (profile?.type !== PROFILE_TYPE.CLIENT) {
      throw new BadRequestError('User id not of type client');
    }

    const jobsReader = new JobsReader(this.Job, this.Contract);

    return sequelize.transaction(async (transaction) => {
      const totalJobsAmount = await jobsReader.getTotalJobsAmount(profile.id);
      const maxDepositLimit = totalJobsAmount * 0.25;
      console.debug(`Total job amount: ${totalJobsAmount}, max limit for deposit: ${maxDepositLimit}`);
      if (amount > maxDepositLimit) {
        throw new BadRequestError(`Maximum permitted amount for deposit is: ${maxDepositLimit}`);
      }

      const updatedBalance = profile.balance + amount;
      await profile.update({ balance: updatedBalance }, { transaction });
      return updatedBalance;
    });
  }
}

module.exports = ProfileService;
