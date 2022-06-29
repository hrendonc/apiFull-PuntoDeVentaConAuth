var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const User = require('../model/users.model')
const { create } = require('../model/token.model');
const {jsonResponse} = require('../lib/jsonResponse')

router.get('/', async function(req, res, next) {
  let result = {}

  try {
    results = await User.find({}, 'username password')
  } catch (error) {
    console.log(error)
  }
  res.json(results)
});

router.post('/', async (req, res, next)=>{
  const {username, password} = req.body
  if(!username || !password){
    next(createError(400, 'No se recibio la informació requerida!'))
  }else if(username && password){
    const user = new User({username, password})
    const exists = await user.usernameExists(username)
    if(exists){
      next(createError(400, 'El nombre de usuario ya existe!'))
    }else{
      await user.save()
      res.json(jsonResponse(200, {
        message: 'Usuario registrado!'
      }))
    }
  }
})

module.exports = router;
