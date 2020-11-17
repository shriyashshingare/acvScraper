const Acv = require('./modules/Acv')
const file = require('./modules/File')
const mongo = require('./modules/DB')
const main = async () => {
    var response = await new Acv().startScraping();
}
main().then(console.log(''))
// document.querySelector("#auction-detail > div.margin-bottom.container > div:nth-child(3) > div > div")  
// table table-striped