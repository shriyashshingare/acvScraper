var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var gridfs = require('mongodb').GridFSBucket;

var Credetials = require('../config')
var fs = require('fs');

let url = Credetials.URL
let acv = Credetials.DB_ACV

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
  if (err) throw err;
  console.log("DB")
  module.exports.usaacv = db.db(acv);
});