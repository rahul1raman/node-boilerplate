const { fetchContractById } = require("../readers/contractsReader");

async function getContractById(req, res) {
    try {
        const { Contract } = req.app.get('models');
        const { id } = req.params;
        const profile = req.profile;

        const contract = await fetchContractById(Contract, id, profile);

        if (!contract) return res.status(404).end();

        res.json(contract);
    } catch (err) {
        res.status(500).json({
            message: 'Something went wrong while calling getContractById',
            error: err.message
        });
    }
}

module.exports = {
    getContractById,
};