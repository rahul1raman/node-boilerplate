const { Op } = require('sequelize');
const { CONTRACT_STATUS } = require('../constants');
const { fetchUnpaidJobs } = require('./jobsReader');

// Mocking necessary Sequelize models and constants
const Job = {};
const Contract = {};
const profileId = 'someProfileId';

describe('fetchUnpaidJobs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of unpaid jobs when there are unpaid jobs for the given profileId', async () => {
    Job.findAll = jest.fn(() =>
      Promise.resolve([
        { id: 1, title: 'Job 1' },
        { id: 2, title: 'Job 2' },
      ]),
    );

    const unpaidJobs = await fetchUnpaidJobs(Job, Contract, profileId);

    expect(Job.findAll).toHaveBeenCalled();
    expect(Job.findAll).toHaveBeenCalledWith({
      include: expect.any(Array),
      where: {
        paid: { [Op.not]: true },
      },
    });

    expect(unpaidJobs).toHaveLength(2);
    expect(unpaidJobs[0].id).toBe(1);
    expect(unpaidJobs[1].title).toBe('Job 2');
  });

  it('should return an empty array when there are no unpaid jobs for the given profileId', async () => {
    Job.findAll = jest.fn(() => Promise.resolve([]));

    const unpaidJobs = await fetchUnpaidJobs(Job, Contract, profileId);

    expect(Job.findAll).toHaveBeenCalled();
    expect(Job.findAll).toHaveBeenCalledWith({
      include: expect.any(Array),
      where: {
        paid: { [Op.not]: true },
      },
    });

    expect(unpaidJobs).toHaveLength(0);
  });

  it('should handle errors thrown by Job.findAll', async () => {
    const errorMessage = 'Database connection error';
    Job.findAll = jest.fn(() => Promise.reject(new Error(errorMessage)));

    await expect(fetchUnpaidJobs(Job, Contract, profileId)).rejects.toThrow(errorMessage);

    expect(Job.findAll).toHaveBeenCalled();
    expect(Job.findAll).toHaveBeenCalledWith({
      include: expect.any(Array),
      where: {
        paid: { [Op.not]: true },
      },
    });
  });

  it('should correctly construct the query using the profileId', async () => {
    Job.findAll = jest.fn((query) => {
      expect(query.where).toEqual({
        paid: { [Op.not]: true },
      });
      expect(query.include[0].where[Op.and][0][Op.or]).toEqual([{ ContractorId: profileId }, { ClientId: profileId }]);
      expect(query.include[0].where[Op.and][1].status).toBe(CONTRACT_STATUS.IN_PROGRESS);
      return Promise.resolve([]);
    });

    await fetchUnpaidJobs(Job, Contract, profileId);

    expect(Job.findAll).toHaveBeenCalled();
    expect(Job.findAll).toHaveBeenCalledWith({
      include: expect.any(Array),
      where: {
        paid: { [Op.not]: true },
      },
    });
  });

  it('should handle empty results from Contract model', async () => {
    Job.findAll = jest.fn(() => Promise.resolve([{ id: 1, title: 'Job 1', Contract: null }]));

    const unpaidJobs = await fetchUnpaidJobs(Job, Contract, profileId);

    expect(Job.findAll).toHaveBeenCalled();
    expect(Job.findAll).toHaveBeenCalledWith({
      include: expect.any(Array),
      where: {
        paid: { [Op.not]: true },
      },
    });

    expect(unpaidJobs).toHaveLength(1);
    expect(unpaidJobs[0].title).toBe('Job 1');
  });
});
