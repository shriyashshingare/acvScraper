const Acv = require('./modules/Acv')

const main = async () => {
    var response = new Acv().startScrapingInsideLink();
}
main().then(console.log(''))