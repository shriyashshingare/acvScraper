const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false
const mongo = require('../modules/DB')
class Acv {
    constructor() {
        this.page;
        this.checkLoggedInSelector = '#breadcrumbs'
    }

    async autoScroll(){
        await this.page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 200;
                var scrollHeight = 5000;
                var timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
    
                    if(totalHeight >= scrollHeight){
                        clearInterval(timer);
                        resolve();
                    }
                }, 500);
            });
        });
    }
    
    async startScrapingInsideLink() {
        try {
            let launchBrowser = await this.launchBrowser()
            console.log('launch', launchBrowser)
            let getLoggedIn = await this.getLoggedIn()
            if (launchBrowser && getLoggedIn) {
                while(1) {
                    //await this.page.waitForTimeout(5000)
                    let sourceUrl = await this.getRandomUrl()
                    let auctionDetails = await this.getDetails(sourceUrl)
                    //console.log(auctionDetails)
                }
            }
        } catch (err) {
            console.log(err.toString())
            return { sucess: false, message: 'Unable to process'}
        }
    }

    async startScraping() {
        const auctionsSelector = ''
        try {
            let launchBrowser = await this.launchBrowser()
            let getLoggedIn = await this.getLoggedIn()
            if (launchBrowser && getLoggedIn) {
               console.log('finished logging in')
               await this.page.click('.header-link.ended-auctions a')
            }

            await this.page.waitForTimeout(2000)
            let countIndex = 0
            while(1) {
                // console.log(countIndex, ' is my count')
                countIndex = await this.getPostDetails(countIndex)
                await this.autoScroll()
            }
        }  catch (err) {
            return { sucess: false, message: 'Unable to process'}
        }
    }

    async getPostDetails(postCounter) {
        let findCount = await this.page.$$(`.container .has-filters-bar [id^="auction-"]`)
        console.log(findCount.length, 'length')
        let postsCount = findCount.length
        let i
        for(i=postCounter; i< postsCount; i++) {
            let auction = await this.page.$(`.container .has-filters-bar [id^="auction-"]:nth-child(${i})`)
            if(auction) {
                let vehicleIsSold = await auction.$eval('.auction-card__content > a > .action-bar > .button-container button', el => el.textContent)
                if(vehicleIsSold == " VEHICLE SOLD ") {
                    let postLink = await auction.$eval('a', el => el.href)
                    let ifDataFound = await mongo.usaacv.collection('acvLink').findOne({ href: postLink})
                    if(!ifDataFound) {
                        await mongo.usaacv.collection('acvLinks').insertOne({href : postLink, status : 0})
                        console.log('adding-', postLink)
                    } else {
                        console.log('already inserted', postLink)
                    }
                } else {
                    console.log('!sold')
                }
            }
        }
        return i
    }

    async launchBrowser() {
        try {
            const browser = await puppeteer.launch({
                headless: PUPPETEER_UI_FLAG,
                executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/Brave.exe'
            })
            this.page = await browser.newPage()

            await this.page.setViewport({ width: 1366, height: 760 })
            return true
        } catch (err) {
            return false
        }


        //const postDetails = await new PostDetails(page)
    }

    async getLoggedIn() {
        try {
            const emailSelector = '#login_email'
            const passSelector = '#login_password'
            const loginButtonSelector = '#login_button'
            const email = 'Staff1@nationalstudentloans.org'
            const pass = 'Password231$'

            await this.page.goto('https://app.acvauctions.com/login')
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

    async getRandomUrl() {
        let url = await mongo.usaacv.collection('acvLinks').aggregate([{$match:{status:0}},{$sample:{size:1}}]).toArray()
        let sourceUrl = url[0].href
        await mongo.usaacv.collection('acvLinks').updateOne({href:sourceUrl}, {$set:{status:1}})
        return sourceUrl
    }

    async getDetails(sourceUrl) {
        console.log('i am here 3')
        const auctionSelector = {
            carName: 'h1.vehicle-name.shimmer',
            tableKeys: '.table-striped .left',
            tableValues: '.table-striped .right',
        }
        //let sourceUrls = await this.getLinks()

        //console.log('scraping for-', sourceUrl)

        this.page.goto(sourceUrl)

        await this.page.waitForSelector('.table-striped')
        await this.page.waitForTimeout(5000)
        console.log('i am here 4')
        let tableKeys = await this.page.evaluate((tableKeysInside) => {
            console.log(tableKeysInside)
            let keys = []
            let keysData = document.querySelectorAll(tableKeysInside)
            for (let i = 0; i < keysData.length; i++) {
                keys.push(keysData[i].innerText)
            }
            return keys
        }, auctionSelector.tableKeys)

        console.log('i am here 5')
        let tableValues = await this.page.evaluate((tableValuesInside) => {
            let values = []
            let valuesData = document.querySelectorAll(tableValuesInside)
            for (let i = 0; i < valuesData.length; i++) {
                values.push(valuesData[i].innerText)
            }
            return values
        }, auctionSelector.tableValues)

        console.log(tableValues, 'right side values')

        console.log('i am here 6')
        let carName = await this.page.evaluate((carNameInside) => {
            let name = document.querySelector(carNameInside).innerText
            return name
        }, auctionSelector.carName)
        console.log('i am here 7')
        let auctionDetails = {}
        auctionDetails["carName"] = carName
        for (let i = 0; i < tableKeys.length && i < tableValues.length; i++) {
            let key = tableKeys[i]
            key =  key.slice(0, -1);
            auctionDetails[key] = tableValues[i]
        }
        console.log(auctionDetails)
        auctionDetails.status = 2;
        this.insertPropertyDetails(sourceUrl, auctionDetails)

        return auctionDetails
    }

    // async getLinks() {
    //     try {
    //         let links = await mongo.usaacv.collection('links').find({ status: 0 }).toArray()
    //         return links
    //     } catch (err) {

    //     }
    // }
    async getAuctionedIds() {

    }

    async insertPropertyDetails(sourceLink, propertyDetails) {
        try {
            await mongo.usaacv.collection("acvLinks").findOneAndUpdate({href:sourceLink, status:1}, {$set:propertyDetails})
        } catch(e) {
            console.log('Unable to insert',e)
        }
    }

}

module.exports = Acv