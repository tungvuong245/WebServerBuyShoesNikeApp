const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CartSchema = new Schema({
    idU:String,
    idShoesToCart:[String],
    idAddress:String,
    idPromo:String,
    idShipping:String,
    createdDate: { type: Number, default: Date.now },
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart