const db = require('mongoose')
require('dotenv').config()

db.Promise = global.Promise

async function connect(){
    await db.connect(process.env.CONNECTDB, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>console.log('Conectado a Mongo DB'))
    .catch(e=>console.log('[Error de conexión DB] - ', e))
}

module.exports = connect