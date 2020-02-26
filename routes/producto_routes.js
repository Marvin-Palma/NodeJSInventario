'use strict'

var express = require('express');
var ProductoController = require('../controllers/producto_controller');

var router = express.Router();


//Rutas útiles
router.post('/saveProducto', ProductoController.save);

module.exports = router;
