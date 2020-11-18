const { timingSafeEqual } = require('crypto');
const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = true
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
                let flag = 1
                while (flag) {
                    let auctionDetails = await this.getRandomVin()
                    if(auctionDetails) {
                        await this.getDetails(auctionDetails)
                    } else {
                        flag = 0
                    }
                }

            }
        } catch (err) {
            return { sucess: false, message: 'Unable to process' }
        }
    }

    async launchBrowser() {
        try {
            this.browser = await puppeteer.launch({
                headless: PUPPETEER_UI_FLAG,
                executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/Brave.exe'
                //executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
            })
            this.page = await this.browser.newPage()

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

    async getDetails(auctionDetails) {
        try {
            console.log('i am here 3')
            const mmrSelector = {
                vinNumber: '#vinText',
                odoMeter: '#Odometer',
                adjustedMmr: '.styles__currency__1TJ6H.show--inline-block',
                click: '.btn-primary',
                odoMeterClick: '.styles__button__rqYJE',
                table: '.mui-table > tbody >tr'
            }

            console.log('scraping for-', auctionDetails)
            await this.page.click(mmrSelector.vinNumber,{clickCount: 3})
            await this.page.type(mmrSelector.vinNumber, auctionDetails.vinNumber)
            await this.page.click(mmrSelector.click)

            await this.page.waitForTimeout(2000)

            let productType = await this.page.evaluate((table) => {
                let element = document.querySelector(table)
                console.log(element)
                if (element) {
                    element.click()
                    return true
                } else {
                    return false
                }
            }, mmrSelector.table)
            if(productType){
                console.log('in type')
                await this.page.waitForTimeout(2000)
            }


            await this.page.type(mmrSelector.odoMeter, auctionDetails.odoMeter)
            await this.page.click(mmrSelector.odoMeterClick)

            await this.page.waitForTimeout(1000)

            let adjustedMmrPrice = await this.page.evaluate((adjustedMmr) => {
                let adjustedPrice = document.querySelectorAll(adjustedMmr)[1].innerText
                return adjustedPrice
            }, mmrSelector.adjustedMmr)

            let baseMmrPrice = await this.page.evaluate((adjustedMmr) => {
                let baseMmrPrice = document.querySelectorAll(adjustedMmr)[0].innerText
                return baseMmrPrice
            }, mmrSelector.adjustedMmr)
            baseMmrPrice = baseMmrPrice.replace(/\D/g, '')
            adjustedMmrPrice = adjustedMmrPrice.replace(/\D/g, '')
            let updateData = {
                status: 4,
                adjustedMmrPrice: adjustedMmrPrice,
                baseMmrPrice:baseMmrPrice
            }

            console.log("updated data", updateData)
            await mongo.usaacv.collection('acvLinks').updateOne({ vin: auctionDetails.vinNumber }, { $set: updateData })
            await this.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

        } catch (err) {
            console.log(err.toString())
        }
    }

    async getRandomVin() {
        try {
            let vin = await mongo.usaacv.collection('acvLinks').aggregate([{ $match: { status: { $in: [2, 3] } } }, { $sample: { size: 1 } }]).toArray()
            if(vin.length > 0 ) {
                let auctionDetails = {
                    vinNumber: vin[0].vin,
                    odoMeter: vin[0].odometer
                }
                await mongo.usaacv.collection('acvLinks').updateOne({ vin: auctionDetails.vinNumber }, { $set: { status: 3 } })
                return auctionDetails
            } else {
                console.log('Done with the script, output in status 3')
                await this.page.close();
                this.page = null;
                await this.browser.close();
                this.browser = null;
                return false
            }
        } catch (err) {
            console.log(err.toString())
            return false
        }
    }



}

module.exports = Mmr