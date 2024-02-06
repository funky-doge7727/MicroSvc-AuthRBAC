const conf = require('./config')

module.exports = async () => {
    Object.keys(conf).map(x =>{
        process.env[x] = conf[x]
        console.log(`env loaded from config.js: ${x}`)
    })
    const enaas = require('./enaas-retriever');
    await enaas.loadSecrets();
}


