'use strict'

var validator = require('validator');
var Factura = require('../models/factura');

var controller = {

    insert: (req, res) => {
        console.log("FACTURA ELECTRONICA");
        var params = req.body;
        //Validar datos (validator)
        try {
            var validate_nombre = !validator.isEmpty(params.nombre.toString());
            var validate_nit = !validator.isEmpty(params.nit.toString());
            var validate_productos = !validator.isEmpty(params.productos.toString());
        } catch (err) {
            return res.status(210).send({
                status: 'error',
                mensaje: 'Faltan datos por enviar'
            });
        }
        if (validate_nombre && validate_nit && validate_productos) {
            //Crear el objeto a guardar
            var factura = new Factura();
            //Asignar valores
            factura.nombre = params.nombre;
            factura.nit = params.nit;
            factura.productos = params.productos;
            factura.fecha = new Date();
            factura.estado = "A"; //Por defecto estará activo 
            ///////////////////Consulta a MongoDB para sacar el correlativo (Código de producto)////////////////
            Factura.findOne({}, (err, ultimaFactura) => {
                if (err || !ultimaFactura) {
                    //No existe ningún registro por lo que debe ser ID 1
                    factura.codigo = 1;
                } else {
                    factura.codigo = ultimaFactura.codigo + 1;
                }
                //Guardar el artículo
                console.log("PRE SAVE");
                factura.save((err, facturaStored) => {
                    console.log(err);
                    if (err || !facturaStored) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'La factura no se ha guardado'
                        });
                    }
                    //Devolver una respuesta
                    return res.status(200).send({
                        status: 'success',
                        producto: facturaStored
                    });
                });
            }).sort({ $natural: -1 });
            ///////////////////Consulta a MongoDB para sacar el correlativo (Código de producto)////////////////
        }
    },
    getFacturas: (req, res) => {
        Factura.find({ estado: "A" }, (err, facturas) => {
            if (err || facturas.length <= 0) {
                return res.status(210).send({
                    status: 'error',
                    message: 'No se encontraron facturas'
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    facturas
                })
            }
        });
    },

}; // end controller

module.exports = controller;