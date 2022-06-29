var express = require('express');
var router = express.Router();
var createError = require('http-errors');
const {jsonResponse} = require('../lib/jsonResponse');
const Product = require('../model/products.model');
const auth = require('../auth/auth.midleware')

router.get('/', auth.checkAuth, async (req, res, next)=>{
    let result = {}

    try {
        results = await Product.find({}, 'title price')
    } catch (error) {
        next(createError(500, 'Error al obtener los productos...'))
    }

    res.json(jsonResponse(200, {results}))
})

router.post('/', async (req, res, next)=>{
    const {title, price} = req.body
    
    if(!title || !price){
        next(createError(400, 'No se puede registrar el producto. Verifique la información introducida'))
    }else if(title && price){
        try {
            const product = new Product({title, price})
            await product.save()
        } catch (error) {
            next(createError(400, 'Error interno, Intente nuevamente'))
        }
        res.json(jsonResponse(200, {message: 'Producto agregado correctamente!'}))
    }
})

router.get('/:idProduct', async (req, res, next)=>{
    let result = {}
    const {idProduct} = req.params

    if(!idProduct) next(createError(400, 'No se recibió el ID del producto de forma correcta.'))

    try {
        result = await Product.findById(idProduct, 'title price')
    } catch (error) {
        next(createError(400, 'Error interno.'))
    }

    res.json(jsonResponse(200, {result}))
})

router.patch('/:idProduct', async (req, res, next)=>{
    let update = {}
    const {idProduct} = req.params
    const {title, price} = req.body 

    if(!idProduct) next(createError(400, 'No recibió de forma correcta el ID del producto.'))
    if(!title && !price ) next(createError(400, 'No recibió alguna información para actualizar.'))

    if(title) update['title'] = title
    if(price) update['price'] = price

    try {
        await Product.findByIdAndUpdate(idProduct, update)
    } catch (error) {
        return next(createError(400, error))
    }

    res.json(jsonResponse(200, `El prducto ${idProduct} se actualizó correctamente.`))
})

router.delete('/:idProduct', async (req, res, next)=>{
    const {idProduct} = req.params

    try {
        await Product.findByIdAndDelete(idProduct)
    } catch (error) {
        return next(createError(400, error))
    }

    res.json(jsonResponse(200, `El producto ${idProduct} se eliminó satisfactoriamente.`))
})

module.exports = router