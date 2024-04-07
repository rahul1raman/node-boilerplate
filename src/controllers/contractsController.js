const ContractsReader = require('../readers/contractsReader');

/**
 * Returns the contract only if it belongs to the profile calling
 * @returns contract by id
 */
async function getContractById(req, res, next) {
  try {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const profile = req.profile;
    const contractsReader = new ContractsReader(Contract);
    const contract = await contractsReader.fetchContractById(id, profile);

    if (!contract) return res.status(404).end();

    res.json(contract);
  } catch (err) {
    next(err);
  }
}

/**
 * Returns all non terminated contracts only if it belongs to the user
 * @returns list of contracts
 */
async function getAllContracts(req, res, next) {
  try {
    const { Contract } = req.app.get('models');
    const profile = req.profile;
    const contractsReader = new ContractsReader(Contract);
    const contracts = await contractsReader.fetchAllContracts(profile);

    if (!contracts || contracts.length === 0) return res.status(404).end();

    res.json(contracts);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getContractById,
  getAllContracts,
};
