const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');

async function fetchContractById(Contract, id, profile) {
  const contract = await Contract.findOne({
    where: {
      [Op.and]: {
        id,
        [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
      },
    },
  });

  return contract;
}

async function fetchAllContracts(Contract, profile) {
  const contracts = await Contract.findAll({
    where: {
      [Op.and]: {
        [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
        status: {
          [Op.ne]: CONTRACT_STATUS.TERMINATED,
        },
      },
    },
  });

  return contracts;
}

module.exports = {
  fetchContractById,
  fetchAllContracts,
};
