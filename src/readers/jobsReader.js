const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');

const fetchUnpaidJobs = async (Job, Contract, profileId) => {
  const jobs = await Job.findAll({
    include: [
      {
        model: Contract,
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

  return jobs;
};

module.exports = {
  fetchUnpaidJobs,
};
