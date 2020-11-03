const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false
const mongo = require('../modules/DB')
class Acv {
    constructor() {
        this.page;
        this.checkLoggedInSelector = '#breadcrumbs'
    }
    async startScrapingInsideLink() {
        try {
            let launchBrowser = await this.launchBrowser()
            console.log('launch', launchBrowser)
            if (launchBrowser) {
                let getLoggedIn = await this.getLoggedIn()
                let auctionDetails = await this.getDetails()
                console.log(auctionDetails)
            }

        } catch (err) {

        }
    }

    async launchBrowser() {
        try {
            const browser = await puppeteer.launch({
                headless: PUPPETEER_UI_FLAG,
            })
            const context = await browser.createIncognitoBrowserContext()
            let page = await context.newPage()

            await page.setViewport({ width: 1366, height: 768 })
            this.page = page
            return true
        } catch (err) {
            return false
        }


        //const postDetails = await new PostDetails(page)
    }

    async getLoggedIn() {
        try {
            const loginSelector = '#login_button'
            const emailSelector = '#login_email'
            const passSelector = '#login_password'
            const loginButtonSelector = '#login_button'
            const email = 'Staff1@nationalstudentloans.org'
            const pass = 'Password231$'

            await this.page.goto('https://app.acvauctions.com/login',{waitUntil:"networkidle2"})
            console.log('i am here 1')
            //getting logged in
            await this.page.waitForSelector(loginSelector)
            //await this.page.click(loginSelector)

            await this.page.waitForSelector(emailSelector)
            await this.page.type(emailSelector, email)
            await this.page.type(passSelector, pass)
            await this.page.click(loginButtonSelector)
            await this.page.waitForSelector(this.checkLoggedInSelector)
            console.log('i am here 2')
            return true
        } catch (err) {
            return false
        }

    }

    async getDetails() {
        console.log('i am here 3')
        const auctionSelector = {
            carName: 'h1.vehicle-name.shimmer',
            tableKeys: '.table-striped .left',
            tableValues: '.table-striped .right',
        }
        //let sourceUrls = await this.getLinks()

        let sourceUrl = 'https://app.acvauctions.com/auction/2183758'
        // await this.getLoggedIn()

        await this.page.goto(sourceUrl,{waitUntil:"networkidle0"} )
        //await this.page.waitForSelector('.table-striped')
        //await this.page.waitForTimeout(500)
        console.log('i am here 4')
        let tableKeys = await this.page.evaluate(() => {
            let keys = []
            let keysData = document.querySelectorAll(auctionSelector.tableKeys).innerText
            for (let i = 0; i < keysData.length; i++) {
                keys.push(keysData[i].innerText)
            }
            return keys
        })
        console.log('i am here 5')
        let tableValues = await this.page.evaluate(() => {
            let values = []
            let valuesData = document.querySelectorAll(auctionSelector.tableValues).innerText
            for (let i = 0; i < valuesData.length; i++) {
                values.push(valuesData[i].innerText)
            }
            return values
        })
        console.log('i am here 6')
        let carName = await this.page.evaluate(() => {
            let name = document.querySelector(auctionSelector.carName).innerText
            return name
        })
        console.log('i am here 7')
        let auctionDetails = []
        auctionDetails['carName'] = carName
        for (let i = 0; i < keys && i < values; i++) {
            auctionDetails[tableKeys[i]] = auctionDetails[tableValues[i]]
        }
        console.log(auctionDetails)
        return auctionDetails
    }

    async getLinks() {
        try {
            let links = await mongo.usaacv.collection('links').find({ status: 0 }).toArray()
            return links
        } catch (err) {

        }
    }
    async getAuctionedIds() {

    }

}

module.exports = Acv