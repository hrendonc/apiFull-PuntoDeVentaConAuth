const Mongoose = require('mongoose')

const ProductSchema = new Mongoose.Schema({
    title: {type: String, require: true},
    price: {type: Number, require: true}
})

module.exports = Mongoose.model('Product', ProductSchema)