const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');
const ContractsReader = require('./contractsReader');

const Contract = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};

describe('fetchContractById', () => {
  it('should return the contract when found for the contractor profile', async () => {
    const contractData = { id: 1, ContractorId: 1 };
    Contract.findOne.mockResolvedValue(contractData);

    const contractReader = new ContractsReader(Contract);
    const contract = await contractReader.fetchContractById(1, 1);

    expect(contract).toEqual(contractData);
    expect(Contract.findOne).toHaveBeenCalledWith({
      where: {
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] },
      },
    });
  });

  it('should return the contract when found for the client profile', async () => {
    const contractData = { id: 1, ClientId: 1 };

    Contract.findOne.mockResolvedValue(contractData);

    const contractReader = new ContractsReader(Contract);
    const contract = await contractReader.fetchContractById(1, 1);

    expect(contract).toEqual(contractData);
    expect(Contract.findOne).toHaveBeenCalledWith({
      where: {
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] },
      },
    });
  });

  it('should return null when contract is not found', async () => {
    Contract.findOne.mockResolvedValue(null);

    const contractReader = new ContractsReader(Contract);
    const contract = await contractReader.fetchContractById(1, 1);
    expect(contract).toBeNull();
  });

  it('should throw an error when an error occurs during database query', async () => {
    Contract.findOne.mockRejectedValue(new Error('Database error'));
    const contractReader = new ContractsReader(Contract);
    await expect(contractReader.fetchContractById(1, 1)).rejects.toThrow('Database error');
  });
});

describe('fetchAllContracts', () => {
  it('should return contracts when found for the contractor profile', async () => {
    const contractData = [{ id: 1, ContractorId: 1 }];
    Contract.findAll.mockResolvedValue(contractData);

    const contractReader = new ContractsReader(Contract);
    const contracts = await contractReader.fetchAllContracts(1);

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
    const contractData = [{ id: 1, ClientId: 1 }];
    Contract.findAll.mockResolvedValue(contractData);

    const contractReader = new ContractsReader(Contract);
    const contracts = await contractReader.fetchAllContracts(1);

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
    Contract.findAll.mockResolvedValue([]);
    const contractReader = new ContractsReader(Contract);
    const contracts = await contractReader.fetchAllContracts(1);
    expect(contracts).toEqual([]);
  });

  it('should throw an error when an error occurs during database query', async () => {
    Contract.findAll.mockRejectedValue(new Error('Database error'));

    const contractReader = new ContractsReader(Contract);
    await expect(contractReader.fetchAllContracts(1)).rejects.toThrow('Database error');
  });

  it('should return contracts excluding the terminated ones', async () => {
    const contractData = [
      { id: 1, ClientId: 1, status: CONTRACT_STATUS.NEW },
      { id: 2, ClientId: 1, status: CONTRACT_STATUS.TERMINATED },
    ];
    const expectedContracts = [{ id: 1, ClientId: 1, status: CONTRACT_STATUS.NEW }];

    // Mock the behavior of Contract.findAll method to filter out terminated contracts
    Contract.findAll.mockImplementation(async () => {
      return contractData.filter((contract) => contract.status === CONTRACT_STATUS.NEW);
    });

    const contractReader = new ContractsReader(Contract);
    const contracts = await contractReader.fetchAllContracts(1);

    expect(contracts).toEqual(expectedContracts);
  });
});
