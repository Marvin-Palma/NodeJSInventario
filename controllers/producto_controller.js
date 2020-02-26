'use strict'

var validator = require('validator');
var Producto = require('../models/producto');

var controller = {

    save: (req, res) => {
        //Recoger parámetros por Post
        var params = req.body;
        //Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre);
            var validate_precio = !validator.isEmpty(params.precio);
            var validate_cantidad = !validator.isEmpty(params.cantidad);
            var validate_descripcion = !validator.isEmpty(params.descripcion);
        } catch (err) {
            return res.status(210).send({
                status: 'error',
                mensaje: 'Faltan datos por enviar'
            });
        }

        if (validate_nombre && validate_precio && validate_cantidad && validate_descripcion) {
            //Crear el objeto a guardar
            var producto = new Producto();
            //Asignar valores
            producto.nombre = params.nombre;
            producto.precio = params.precio;
            producto.cantidad = params.cantidad;
            producto.descripcion = params.descripcion;
            //Consulta a MongoDB para sacar el correlativo (Código de producto)

            Producto.findOne({}, (err, ultimoProducto) => {
                if (err || !ultimoProducto) {
                    //No existe ningún registro por lo que debe ser ID 1
                    producto.codigo = 1;
                } else {
                    producto.codigo = ultimoProducto.codigo+1;
                }
                //Guardar el artículo
                producto.save((err, productoStored) => {
                    if (err || !productoStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'El producto no se ha guardado'
                        });
                    }
                    //Devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        producto: productoStored
                    });
                });
            }).sort({ $natural: -1 });


        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }

    },
}; // end controller

module.exports = controller;