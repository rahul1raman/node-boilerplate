const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');

class ContractsReader {
  constructor(Contract) {
    this.Contract = Contract;
  }

  async fetchContractById(id, profile) {
    return this.Contract.findOne({
      where: {
        [Op.and]: {
          id,
          [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
        },
      },
    });
  }

  async fetchAllContracts(profile) {
    return this.Contract.findAll({
      where: {
        [Op.and]: {
          [Op.or]: [{ ContractorId: profile.id }, { ClientId: profile.id }],
          status: {
            [Op.ne]: CONTRACT_STATUS.TERMINATED,
          },
        },
      },
    });
  }
}

module.exports = ContractsReader;
