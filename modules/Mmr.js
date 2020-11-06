const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false
const mongo = require('../modules/DB')
class Mmr {
    constructor() {
        this.page;
        this.acvLinks = 'acvLinks'
        this.checkLoggedInSelector = '#vinText'
    }

    async startScraping() {
        const auctionsSelector = ''
        try {
            let launchBrowser = await this.launchBrowser()
            let getLoggedIn = await this.getLoggedIn()
            if (launchBrowser && getLoggedIn) {
                console.log('finished logging in')
                await this.getDetails()
            }
        } catch (err) {
            return { sucess: false, message: 'Unable to process' }
        }
    }

    async launchBrowser() {
        try {
            const browser = await puppeteer.launch({
                headless: PUPPETEER_UI_FLAG,
                //executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/Brave.exe'
                executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
            })
            this.page = await browser.newPage()

            await this.page.setViewport({ width: 1366, height: 760 })
            return true
        } catch (err) {
            console.log(err.toString())
            return false
        }


        //const postDetails = await new PostDetails(page)
    }

    async getLoggedIn() {
        try {
            const emailSelector = '#user_username'
            const passSelector = '#user_password'
            const loginButtonSelector = '#submit'
            const email = 'trieper1'
            const pass = 'KuntaKinte162$'

            await this.page.goto('https://mmr.manheim.com/?WT.svl=m_uni_hdr_buy&country=US&popup=true&source=man')
            console.log('i am here 1')
            //getting logged in
            await this.page.waitForSelector(loginButtonSelector)
            await this.page.type(emailSelector, email)
            await this.page.type(passSelector, pass)
            await this.page.click(loginButtonSelector)
            await this.page.waitForSelector(this.checkLoggedInSelector)
            return true
        } catch (err) {
            return false
        }

    }

    async getDetails() {
        console.log('i am here 3')
        const mmrSelector = {
            vinNumber: '#vinText',
            odoMeter: '#Odometer',
            adjustedMmr: '.show--inline-block[data-reactid="395"]',
            click: '.btn-primary',
            odoMeterClick:'[data-reactid="309"]'
        }
        let auctionDetails = await this.getRandomVin()

        console.log('scraping for-', auctionDetails)
        if(auctionDetails){

        }
        await this.page.type(mmrSelector.vinNumber, auctionDetails.vinNumber)
        await this.page.click(mmrSelector.click)
        await this.page.waitForTimeout(4000)
        await this.page.type(mmrSelector.odoMeter, auctionDetails.odoMeter)
        await this.page.click(mmrSelector.odoMeterClick)
        await this.page.waitForTimeout(4000)
        let adjustedMmrPrice = await this.page.evaluate((adjustedMmr) => {
            let adjustedPrice = document.querySelector(adjustedMmr).innerText
            return adjustedPrice
        }, mmrSelector.adjustedMmr)
        adjustedMmrPrice = adjustedMmrPrice.replace('$','')
        let updateData =
        {
            status: 4,
            adjustedMmrPrice: adjustedMmrPrice
        }
        console.log("updated data",updateData)
        await mongo.usaacv.collection('acvLinks').updateOne({ VIN: auctionDetails.vinNumber }, { $set: updateData })
    }

    async getRandomVin() {
        try {
            let vin = await mongo.usaacv.collection('acvLinks').aggregate([{ $match: { status: 2 } }, { $sample: { size: 1 } }]).toArray()
            let auctionDetails = {
                vinNumber: vin[0].VIN,
                odoMeter: vin[0].Odometer
            }
            await mongo.usaacv.collection('acvLinks').updateOne({ VIN: auctionDetails.vinNumber }, { $set: { status: 3 } })
            return auctionDetails
        } catch (err) {
            console.log(err.toString())
            return false
        }

    }



}

module.exports = Mmr