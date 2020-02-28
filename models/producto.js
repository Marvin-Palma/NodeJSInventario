'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    nombre: String,
    precio: String,
    cantidad: Number,
    descripcion: String,
    imagen: String,
    codigo: Number,
    estado: String
});

module.exports = mongoose.model('Producto', ProductoSchema);


