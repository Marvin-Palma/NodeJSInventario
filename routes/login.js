'use strict'

var express = require('express');
var UserController = require('../controllers/user_controller');

var router = express.Router();

//var multipart = require('connect-multiparty');
//var md_upload = multipart({uploadDir: './upload/articles'});


//Rutas útiles
router.post('/save', UserController.save);
router.get('/getUser/:correo/:password', UserController.getUser);

module.exports = router;
