const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');

class ContractsReader {
  constructor(Contract) {
    this.Contract = Contract;
  }

  async fetchContractById(id, profileId) {
    return this.Contract.findOne({
      where: {
        [Op.and]: {
          id,
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        },
      },
    });
  }

  async fetchAllContracts(profileId) {
    return this.Contract.findAll({
      where: {
        [Op.and]: {
          [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          status: {
            [Op.ne]: CONTRACT_STATUS.TERMINATED,
          },
        },
      },
    });
  }
}

module.exports = ContractsReader;
