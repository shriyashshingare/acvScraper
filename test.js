const Acv = require('./modules/Acv')

const main = async () => {
    var response = await new Acv().startScraping();
}
main().then(console.log(''))
