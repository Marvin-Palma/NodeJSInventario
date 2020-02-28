'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3900;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest_inventario', {useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
//mongoose.connect('mongodb+srv://Marvin-Palma:6KXVmzrum3fchLMj@cluster0-enslb.mongodb.net/test?retryWrites=true&w=majority', {useUnifiedTopology: true, useNewUrlParser: true}).then(()=>{
    console.log("La conexión a la base de datos se ha realizado bien!!!");
    //Crear servidor y escuchar peticiones htpp
    app.listen(port, ()=>{
        console.log('Servidor corriendo en http://localhost:'+port);
    });
}).catch((err)=>{
    console.log("No se pudo conectar a la base de datos!!!");
    console.log(err);
});