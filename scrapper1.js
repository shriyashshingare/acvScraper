const Acv = require('./modules/Acv')
const file = require('./modules/File')
const mongo = require('./modules/DB')
const main = async () => {
    for (let i = 0; i < 4; i++) {
        var response = await new Acv().startScraping();
    }
}
main().then(console.log(''))
// document.querySelector("#auction-detail > div.margin-bottom.container > div:nth-child(3) > div > div")
// table table-striped