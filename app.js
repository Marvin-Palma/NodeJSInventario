'use strict'
 
//Cargar módulos de Node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar Express (http)
var app = express();

//Cargar Ficheros Rutas
var login_routes = require('./routes/login');
var producto_routes = require('./routes/producto_routes');

//Cargar Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Activar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas / Cargar rutas

app.use('/api', login_routes);
app.use('/api', producto_routes);

//Exportar el módulo (fichero actual)
module.exports = app;
