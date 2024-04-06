const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');

const { contract } = require('./routes/contracts');

// app initialization
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// routes
app.use('/contracts', getProfile, contract);

module.exports = app;
