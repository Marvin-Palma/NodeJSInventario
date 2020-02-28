'use strict'

var express = require('express');
var multipart = require('connect-multiparty');
var ProductoController = require('../controllers/producto_controller');

var router = express.Router();
var md_upload = multipart({uploadDir: './upload/productos'});


//Rutas útiles
router.post('/saveProducto', md_upload, ProductoController.save);
router.get('/get-image-producto/:imagen', ProductoController.getImage);
router.get('/get-productos', ProductoController.getProductos);

module.exports = router;
