const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false
const mongo = require('./DB')
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
        } catch (err) {
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
                        await mongo.usaacv.collection('acvLinks').insertOne({href : postLink})
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
            })
            const context = await browser.createIncognitoBrowserContext()
            this.page = await context.newPage()

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

}

module.exports = Acv