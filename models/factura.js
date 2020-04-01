'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    nombre: String,
    nit: String,
    productos: Array,
    fecha: String,
    codigo: Number,
    estado: String
});

module.exports = mongoose.model('Factura', FacturaSchema);


