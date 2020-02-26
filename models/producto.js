'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    precio: String,
    cantidad: Number,
    descripcion: String,
    codigo: Number
});

module.exports = mongoose.model('Producto', ProductoSchema);


