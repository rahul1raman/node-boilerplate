const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');
const { fetchContractById, fetchAllContracts } = require('./contractsReader');

const Contract = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};

describe('fetchContractById', () => {
  it('should return the contract when found for the contractor profile', async () => {
    const profile = { id: 1 };

    const contractData = { id: 1, ContractorId: 1 };
    Contract.findOne.mockResolvedValue(contractData);

    const contract = await fetchContractById(Contract, 1, profile);

    expect(contract).toEqual(contractData);
    expect(Contract.findOne).toHaveBeenCalledWith({
      where: {
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] },
      },
    });
  });

  it('should return the contract when found for the client profile', async () => {
    const profile = { id: 1 };

    const contractData = { id: 1, ClientId: 1 };

    Contract.findOne.mockResolvedValue(contractData);

    const contract = await fetchContractById(Contract, 1, profile);

    expect(contract).toEqual(contractData);
    expect(Contract.findOne).toHaveBeenCalledWith({
      where: {
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] },
      },
    });
  });

  it('should return null when contract is not found', async () => {
    const profile = { id: 1 };

    Contract.findOne.mockResolvedValue(null);

    const contract = await fetchContractById(Contract, 1, profile);
    expect(contract).toBeNull();
  });

  it('should throw an error when an error occurs during database query', async () => {
    const profile = { id: 1 };

    Contract.findOne.mockRejectedValue(new Error('Database error'));

    await expect(fetchContractById(Contract, 1, profile)).rejects.toThrow('Database error');
  });
});

describe('fetchAllContracts', () => {
  it('should return contracts when found for the contractor profile', async () => {
    const profile = { id: 1 };
    const contractData = [{ id: 1, ContractorId: 1 }];
    Contract.findAll.mockResolvedValue(contractData);
    const contracts = await fetchAllContracts(Contract, profile);
    expect(contracts).toEqual(contractData);
    expect(Contract.findAll).toHaveBeenCalledWith({
      where: {
        [Op.and]: {
          [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }],
          status: { [Op.ne]: CONTRACT_STATUS.TERMINATED },
        },
      },
    });
  });

  it('should return contracts when found for the client profile', async () => {
    const profile = { id: 1 };
    const contractData = [{ id: 1, ClientId: 1 }];
    Contract.findAll.mockResolvedValue(contractData);
    const contracts = await fetchAllContracts(Contract, profile);
    expect(contracts).toEqual(contractData);
    expect(Contract.findAll).toHaveBeenCalledWith({
      where: {
        [Op.and]: {
          [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }],
          status: { [Op.ne]: CONTRACT_STATUS.TERMINATED },
        },
      },
    });
  });

  it('should return an empty array when no contracts are found', async () => {
    const profile = { id: 1 };
    Contract.findAll.mockResolvedValue([]);
    const contracts = await fetchAllContracts(Contract, profile);
    expect(contracts).toEqual([]);
  });

  it('should throw an error when an error occurs during database query', async () => {
    const profile = { id: 1 };
    Contract.findAll.mockRejectedValue(new Error('Database error'));
    await expect(fetchAllContracts(Contract, profile)).rejects.toThrow('Database error');
  });

  it('should return contracts excluding the terminated ones', async () => {
    const profile = { id: 1 };
    const contractData = [
      { id: 1, ClientId: 1, status: CONTRACT_STATUS.NEW },
      { id: 2, ClientId: 1, status: CONTRACT_STATUS.TERMINATED },
    ];
    const expectedContracts = [{ id: 1, ClientId: 1, status: CONTRACT_STATUS.NEW }];

    // Mock the behavior of Contract.findAll method to filter out terminated contracts
    Contract.findAll.mockImplementation(async () => {
      return contractData.filter((contract) => contract.status === CONTRACT_STATUS.NEW);
    });

    const contracts = await fetchAllContracts(Contract, profile);

    expect(contracts).toEqual(expectedContracts);
  });
});
