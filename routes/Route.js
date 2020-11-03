const express = require('express');
const api = express.Router();
const acvController = require('../controller/AcvController') 
api.use('/api/startScraping', acvController.startScraping);


module.exports = api;