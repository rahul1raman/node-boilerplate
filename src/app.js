const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const errorHandler = require('./middleware/errorHandler');
const { sample } = require('./routes/sample');

// app initialization
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

// routes
app.use('/sample', sample);

// Last middleware to use
app.use(errorHandler);

module.exports = app;
