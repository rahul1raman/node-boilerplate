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

  async getBestClients(start, end, limit = 2) {
    if (!start || !end || !Date.parse(start) || !Date.parse(end) || Date.parse(start) > Date.parse(end)) {
      throw new BadRequestError('Invalid Params: Start and end date required');
    }

    /*
        Equivalent SQL query:

        SELECT 
            `Contract->Client`.id AS id,
            `Contract->Client`.firstName || ' ' || `Contract->Client`.lastName AS fullName,
             SUM(Job.price) AS paid
        FROM 
            Jobs AS Job
            INNER JOIN Contracts AS Contract ON Job.ContractId = Contract.id
            INNER JOIN Profiles AS Client ON Contract.ClientId = Client.id
        WHERE 
            Job.paid = TRUE
            AND Job.paymentDate BETWEEN [start] AND [end]
        GROUP BY 
            Contract.ClientId
        ORDER BY 
            paid DESC
        LIMIT [limit];

    */

    return this.Job.findAll({
      attributes: [
        [col('Contract.Client.id'), 'id'],
        [literal("`Contract->Client`.`firstName` || ' ' ||  `Contract->Client`.`lastName`"), 'fullName'],
        [fn('SUM', col('price')), 'paid'],
      ],
      include: [
        {
          model: this.Contract,
          attributes: [],
          include: [
            {
              model: this.Profile,
              as: 'Client',
              attributes: ['id', 'firstName', 'lastName'],
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
      group: ['Contract.Client.id'],
      order: [[literal('paid'), 'DESC']],
      limit,
    });
  }
}

module.exports = AdminReader;
