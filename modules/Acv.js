const puppeteer = require('puppeteer')
const PUPPETEER_UI_FLAG = false

class Acv {
    constructor() {
        this.page;
        this.checkLoggedInSelector = '#breadcrumbs'
    }
    async startScraping() {
        try {
            let launchBrowser = await this.launchBrowser()
            console.log('launch',launchBrowser)
            if (launchBrowser) {
                let getLoggedIn = await this.getLoggedIn()
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

            await this.page.goto('https://app.acvauctions.com/login')
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

    // async getDetails() {
    //     const propertySelector = {
    //         price : '.classified__price .sr-only',
    //         address : '.classified__information--address-clickable',
    //         agencyName:'#customer-card > div.customer-card__body > div',
    //         agencyLogo:'#customer-card > div.customer-card__body > div img'
    //     }

    //     // const propertySelectorRegex = {
    //     //     propertyType = /(?<=classified\/).*(?=\/for-sale)/
    //     // }


    //     await db.start()

    //     let sourceUrl = 'https://www.immoweb.be/en/classified/house/for-sale/woluwe-saint-pierre/1150/8856902?searchId=5f758f8b89133and/for-sale/mouscron/7700/8566383'
    //     await this.getLoggedIn()
    //     await this.page.goto(sourceUrl,{waitUntil: "networkidle2"})

    //     await this.page.waitForTimeout(500)

    //     let propertyDetails = {
    //         price: null,
    //         address: null,
    //         category: null,
    //         livingSurface: null,
    //         outdoorSurface: null,
    //         noOfBedrooms: null,
    //         noOfBathrooms: null,
    //         noOfToilets: null,
    //         energyClass: null,
    //         yearBuilt: null,
    //         buildingConditions: null,

    //         agencyLogo:null,
    //         agencyName: null,
    //         agencyAddress:null,
    //         agencyContact:null,
    //         agencyWebsite:null,

    //         postedOn:null,
    //         views:null,
    //         saves:null
    //     }

    //     let regexPatterns = {
    //         category : new RegExp('(?<=classified\/).*(?=\/for-sale)',''),
    //         outdoorSurface : ''
    //     }

    //     let sData = await this.page.evaluate(()=>{
    //         let statData = document.querySelector("#main-content > div:nth-child(2) > div > div > div.classified__section--statistic > p").innerText
    //         return statData
    //     })
    //     //console.log(sData)
    //     sData = sData.split('|')
    //     let statStr=''
    //     for(let i=0;i<sData.length;i++){
    //         statStr += sData[i]+'\n'
    //     }
    //     console.log(statStr)
    //     if(await this.page.$(propertySelector.price)) {
    //         propertyDetails.price = await this.page.$eval(propertySelector.price, e=> e.innerText)
    //     }

    //     if(await this.page.$(propertySelector.address)) {
    //         propertyDetails.address = await this.page.$eval(propertySelector.address, e=> e.innerText)
    //     }
    //     if(await this.page.$(propertySelector.agencyName)) {
    //         propertyDetails.agencyName = await this.page.$eval(propertySelector.agencyName, e=> e.innerText)
    //     }
    //     if(await this.page.$(propertySelector.agencyLogo)) {
    //         propertyDetails.agencyLogo = await this.page.$eval(propertySelector.agencyLogo, e=> e.src)
    //     }

    //     propertyDetails.category = await this.page.url().match(regexPatterns.category)[0]


    //     let textualData = await this.page.evaluate(()=>{
    //         let dataInText = ''
    //         let data = document.querySelectorAll('.classified-table__row')

    //         for(let i=0; i<data.length; i++) {
    //             dataInText += JSON.stringify(data[i].innerText) + '\n'
    //         }
    //         return dataInText
    //     })
    //     //exterior surface
    //     //if(textualData.match(regexPatterns.outdoorSurface)) propertyDetails.outdoorSurface = await textualData.match(regexPatterns.outdoorSurface)[0]
    //     //console.log(textualData)
    //     let m
    //     if(m = await textualData.match(/(?<=Surface of the plot\\t)\d+/gm)) {
    //         propertyDetails.outdoorSurface = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Bedrooms\\t)\d+/gm)) {
    //         propertyDetails.noOfBedrooms = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Bathrooms\\t)\d+/gm)) {
    //         propertyDetails.noOfBathrooms = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Toilets\\t)\d+/gm)) {
    //         propertyDetails.noOfToilets = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Living area\\t)\d+/gm)) {
    //         propertyDetails.livingSurface = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Energy class\\t)\w+/gm)) {
    //         propertyDetails.energyClass = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Construction year\\t)\d+/gm)) {
    //         propertyDetails.yearBuilt = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Building condition\\t).+(?=")/gm)) {
    //         propertyDetails.buildingConditions = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Website\\t).+(?=")/gm)) {
    //         propertyDetails.agencyWebsite = m[0]
    //     }
    //     if(m = await textualData.match(/(?<=Address\\t).+(?=")/gm)) {
    //         propertyDetails.agencyAddress = m[0]
    //     }
    //     if(m = await statStr.match(/(?<=Posted the ).+/gm)) {
    //         propertyDetails.postedOn = m[0]
    //     }
    //     if(m = await statStr.match(/(?<=Views: )\d+/gm)) {
    //         propertyDetails.views = m[0]
    //     }
    //     if(m = await statStr.match(/(?<=Saves: )\d+/gm)) {
    //         propertyDetails.saves = m[0]
    //     }





    //     console.log(await propertyDetails)
    // }

    // async getAuctionedIds(){

    // }

}

module.exports = Acv