const Mmr = require('./modules/Mmr')

const main = async () => {
    var response = await new Mmr().startScraping();
}
main().then(console.log(''))