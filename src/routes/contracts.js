const { Router } = require('express');
const router = Router();
const {getContractById} = require('../controllers/contractsController');

/**
 * Returns the contract only if it belongs to the profile calling
 * @returns contract by id
 */
router.get('/:id', getContractById);

module.exports = {
    contract: router
};
