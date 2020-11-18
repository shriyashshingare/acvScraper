const Mmr = require('./modules/Mmr')

const main = async () => {
    for (let i = 0; i < 4; i++) {
        var response = await new Mmr().startScraping();
    }
}
main().then(console.log(''))