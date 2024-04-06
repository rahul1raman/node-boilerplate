const { fetchContractById } = require('./contractsReader');

const { Op } = require('sequelize');

const Contract = {
  findOne: jest.fn()
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
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] }
      }
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
        [Op.and]: { id: 1, [Op.or]: [{ ContractorId: 1 }, { ClientId: 1 }] }
      }
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
