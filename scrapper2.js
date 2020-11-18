const Acv = require('./modules/Acv')

const main = async () => {
    for (let i = 0; i < 4; i++) {
        var response = new Acv().startScrapingInsideLink();
    }
}
main().then(console.log(''))