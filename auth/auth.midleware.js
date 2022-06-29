require('dotenv').config()
const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = process.env

exports.checkAuth = function(req, res, next){
    const header = req.header('Authorization')

    if (!header) {
        throw new Error('Acceso Denegado!')
    }else{
        //Authorization: bearer se5g564754gwwef234gd45t6e4
        const [bearer, token] = header.split(' ')

        if (bearer == 'Bearer'  && token) {
            try {
                const payload = jwt.verify(token, ACCESS_TOKEN_SECRET)
                req.user = payload.user
                next()
            } catch (error) {
                if(error.name == 'TokenExpiredError'){
                    throw new Error('Token expirado. Logear nuevamente')
                }else if(error.name == 'JsonWebTokenError'){
                    throw new Error('Token no valido!')
                }
            }
        }else{
            throw new Error('Token incorrecto!')
        }
    }
}