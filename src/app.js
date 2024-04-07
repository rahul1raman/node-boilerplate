const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const errorHandler = require('./middleware/errorHandler');

const { contracts } = require('./routes/contracts');
const { jobs } = require('./routes/jobs');
const { balances } = require('./routes/balances');

// app initialization
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// routes
app.use('/contracts', getProfile, contracts);
app.use('/jobs', getProfile, jobs);
app.use('/balances', balances);

// Last middleware to use
app.use(errorHandler);

module.exports = app;
