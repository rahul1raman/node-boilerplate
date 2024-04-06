const { Op } = require('sequelize');


async function fetchContractById(Contract, id, profile) {
    const contract = await Contract.findOne({
        where: {
            [Op.and]: {
                id,
                [Op.or]: [
                    { ContractorId: profile.id },
                    { ClientId: profile.id }
                ]
            }
        }
    });

    return contract;
}


module.exports = {
    fetchContractById,
};