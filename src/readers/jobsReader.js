const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');

class JobsReader {
  constructor(Job, Contract) {
    this.Job = Job;
    this.Contract = Contract;
  }

  async fetchUnpaidJobs(profileId) {
    return this.Job.findAll({
      include: [
        {
          model: this.Contract,
          where: {
            [Op.and]: [
              {
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
              },
              { status: CONTRACT_STATUS.IN_PROGRESS },
            ],
          },
        },
      ],
      where: {
        paid: { [Op.not]: true },
      },
    });
  }

  async findJobByIdForClient(clientId, jobId) {
    return this.Job.findOne({
      include: [
        {
          model: this.Contract,
          where: { ClientId: clientId },
        },
      ],
      where: {
        id: jobId,
      },
    });
  }

  async getTotalJobsAmount(clientId, status = CONTRACT_STATUS.IN_PROGRESS) {
    return this.Job.sum('price', {
      include: [
        {
          model: this.Contract,
          where: {
            ClientId: clientId,
            status,
          },
        },
      ],
      where: { paid: { [Op.not]: true } },
    });
  }
}

module.exports = JobsReader;
