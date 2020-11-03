const express = require('express');
const api = express.Router();
const acvController = require('../controller/AcvController') 
const fileController = require('../controller/FileController')

api.use('/api/startScraping', acvController.startScraping);

api.use('/api/generateFile', fileController.generateFile);


module.exports = api;