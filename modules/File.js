const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false
const json2xls = require('json2xls');
const mongo = require('../modules/DB')
const fs = require('fs')
class File {
    constructor() {
        this.acvLinks = 'acvLinks'
    }
    async generateFile() {
        try {
            let data = await mongo.usaacv.collection('acvLinks').find({ status: 2 }).toArray()
            console.log(data)
            let xls = json2xls(data);
            fs.writeFileSync('data.xlsx', xls, 'binary');
            return true
        } catch (err) {
            return false
        }

    }
}

module.exports = File