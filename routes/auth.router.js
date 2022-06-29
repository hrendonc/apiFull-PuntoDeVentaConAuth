var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const jwt = require('jsonwebtoken')
const Product = require('../model/products.model');
const User = require('../model/users.model')
const Token = require('../model/token.model')
const {jsonResponse} = require('../lib/jsonResponse');
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} = process.env

router.post('/signup', async (req, res, next)=>{
  const {username, password} = req.body
  if(!username || !password){
    next(createError(400, 'No se recibio nombre de usuario y/o password!'))
  }else if(username && password){
    const user = new User({username, password})
    const exists = await user.usernameExists(username)
    if(exists){
      next(createError(400, 'El nombre de usuario ya existe!'))
    }else{
        const accessToken = user.createAccessToken()
        const refreshToken = await user.createRefreshToken()
        await user.save()
        
        res.json(jsonResponse(200, {
        message: 'Usuario registrado!',
        accessToken,
        refreshToken
      }))
    }
  }
})

router.post('/login', async (req, res, next)=>{
  const {username, password} = req.body

  if(!username || !password){
    next(createError(400, 'No se recibio nombre de usuario y/o password!'))
  }else if(username && password){
    try {
      let user = new User({username, password})
      const userExists = user.usernameExists(username)

      if(userExists){
        user = await User.findOne({username: username})

        const passwordCorrect = user.isCorrectPassword(password, user.password)

        if (passwordCorrect) {
          const  accessToken = user.createAccessToken()
          const refreshToken = await user.createRefreshToken()

          res.json(jsonResponse(200, {message:'User informacion correct.', accessToken, refreshToken}))
        }else{
          next(createError(400, 'Usuario y/o Password incorrecto'))
        }
      }else{
        next(createError(400, 'Usuario y/o Password incorrecto'))
      }
    } catch (error) {
      next(createError(400, error))
    }
  }
})

router.post('/logout', async (req, res, next)=>{
  const {refreshToken} = req.body

  if(!refreshToken) next(createError(400, 'No token provided'))
  try {
    await Token.findOneAndRemove({token: refreshToken})
    res.json(jsonResponse(200, {message:'Loguot Successfully'}))
  } catch (error) {
    next(createError(400, 'No token found'))
  }
})

router.post('/refreshToken', async (req, res, next)=>{
  const {refreshToken} = req.body

  if(!refreshToken) next(createError(400, 'No token provided'))

  try {
    const tokenDoc = await Token.findOne({token: refreshToken})

    if(!tokenDoc){
      next(createError(400, 'No token found.'))
    }else{
      const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET)
      const accessToken = jwt.sign({user: payload}, ACCESS_TOKEN_SECRET, {expiresIn: '1d'})

      res.json(jsonResponse(200, {
        message: 'Access token updated.',
        accessToken
      }))
    }

  } catch (error) {
    next(createError(400, 'No token found.'))
  }
})

module.exports = router