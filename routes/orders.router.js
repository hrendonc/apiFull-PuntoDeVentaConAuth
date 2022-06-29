var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const {jsonResponse} = require('../lib/jsonResponse');
const Order = require('../model/orders.model');

router.get('/', async(req, res, next)=>{
    let result = {}
    try {
        result = await Order.find()
    } catch (error) {
        return next(createError(400, error))
    }
    res.json(jsonResponse(200, {result}))
})

router.post('/', async (req, res, next)=>{
    const {iduser, products} = req.body

    if(!iduser || !products){
        next(createError(400, 'No se recibió información para crear una orden.'))
    }else if(iduser && products && products.length>0){
        const order = new Order({iduser, products})

        try {
            const result = await order.save()
        } catch (error) {
            return next(createError(400, error))
        }
        res.json(jsonResponse(200, { message: 'Orden creada exitosamente.'}))
    }
})

module.exports = router