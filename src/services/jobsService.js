const updateBalances = async ({ client, job, transaction, Profile }) => {
  const contractor = await Profile.findByPk(job.Contract.ContractorId, { transaction });

  await client.update({ balance: client.balance - job.price }, { transaction });

  await contractor?.update({ balance: contractor.balance + job.price }, { transaction });
};

const updateJobPaymentStatus = async (job, transaction) => {
  return job.update({ paid: true, paymentDate: new Date() }, { transaction });
};

module.exports = {
  updateBalances,
  updateJobPaymentStatus,
};
