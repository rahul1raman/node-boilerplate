const { Router } = require('express');
const router = Router();
const {getContractById, getAllContracts} = require('../controllers/contractsController');

router.get('/:id', getContractById);
router.get('/', getAllContracts);

module.exports = {
    contract: router
};
