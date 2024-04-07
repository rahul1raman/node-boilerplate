const { Sequelize, Op } = require('sequelize');
const { col, fn, literal } = Sequelize;

const BadRequestError = require('../errors/BadRequestError');

class AdminReader {
  constructor(Job, Profile, Contract) {
    this.Job = Job;
    this.Profile = Profile;
    this.Contract = Contract;
  }

  async getBestProfession(start, end) {
    if (!start || !end || !Date.parse(start) || !Date.parse(end) || Date.parse(start) > Date.parse(end)) {
      throw new BadRequestError('Invalid Params: Start and end date required');
    }
    /*
            Equivalent SQL query:

            SELECT 
                Contractor.profession AS profession,
                SUM(Job.price) AS totalEarned
            FROM 
                Jobs AS Job
                INNER JOIN Contracts AS Contract ON Job.ContractId = Contract.id
                INNER JOIN Profiles AS Contractor ON Contract.ContractorId = Contractor.id
            WHERE 
                Job.paid = TRUE
                AND Job.paymentDate BETWEEN [start] AND [end]
            GROUP BY 
                Contractor.profession
            ORDER BY 
                total DESC
            LIMIT 1;
        */

    return this.Job.findAll({
      attributes: [
        [col('Contract.Contractor.profession'), 'profession'],
        [fn('SUM', col('price')), 'totalEarned'],
      ],
      include: [
        {
          model: this.Contract,
          attributes: [],
          include: [
            {
              model: this.Profile,
              as: 'Contractor',
              attributes: ['profession'],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: {
          [Op.between]: [start, end],
        },
      },
      group: ['Contract.Contractor.profession'],
      order: [[literal('totalEarned'), 'DESC']],
      limit: 1,
    });
  }
}

module.exports = AdminReader;
