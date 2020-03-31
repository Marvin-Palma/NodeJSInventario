'use strict'

var express = require('express');
var FacturaController = require('../controllers/factura_controller');

var router = express.Router();


//Rutas útiles
router.post('/insert-factura', FacturaController.insert);
router.get('/get-facturas', FacturaController.getFacturas);

module.exports = router;
