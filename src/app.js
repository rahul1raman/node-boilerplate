const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const { contracts } = require('./routes/contracts');
const { jobs } = require('./routes/jobs');

// app initialization
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// routes
app.use('/contracts', getProfile, contracts);
app.use('/jobs', getProfile, jobs);

module.exports = app;
