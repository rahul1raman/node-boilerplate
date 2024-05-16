// const SampleReader = require('../readers/sampleReader');
// const { sampleService } = require('../services/sampleService');

async function knockKnock(req, res, next) {
  try {
    res.json({ message: 1 });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  knockKnock,
};
