'use strict'

var validator = require('validator');
var Producto = require('../models/producto');
var fs = require('fs');
var path = require('path');

var controller = {

    save: (req, res) => {
        /////////////////Conseguir el nombre y la extensión/////////////////////
        var file_path = req.files.file0.path; //<------Path del archivo
        var file_split = file_path.split('\\');
        var file_name = file_split[2];// <-------------Nombre del archivo
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1]; // <--------Extensión del archivo
        /////////////////Conseguir el nombre y la extensión/////////////////////

        ////////////////Validación de datos////////////////////////////////////
        if (!req.files.file0.originalFilename || (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif')) {
            fs.unlink(file_path, (err) => { // Unlink permite borrar un archivo
                return res.status(404).send({
                    status: 'error',
                    message: "Imagen inválida!!!"
                });
            });
            ////////////////Validación de datos////////////////////////////////////
        } else {
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
                producto.imagen = file_name;
                producto.estado = "A"; //Por defecto estará activo 
                ///////////////////Consulta a MongoDB para sacar el correlativo (Código de producto)////////////////
                Producto.findOne({}, (err, ultimoProducto) => {
                    if (err || !ultimoProducto) {
                        //No existe ningún registro por lo que debe ser ID 1
                        producto.codigo = 1;
                    } else {
                        producto.codigo = ultimoProducto.codigo + 1;
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
                ///////////////////Consulta a MongoDB para sacar el correlativo (Código de producto)////////////////
            } else {
                fs.unlink(file_path, (err) => { // Unlink permite borrar un archivo
                    return res.status(210).send({
                        status: 'error',
                        message: 'Los datos no son válidos!!!'
                    });
                });
            }
        }
    },

    getProductos: (req, res) => {
        Producto.find({ estado: "A" }, (err, productos) => {
            if (err || productos.length <= 0) {
                return res.status(210).send({
                    status: 'error',
                    message: 'No se encontraron productos'
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    productos
                })
            }
        });
    },

    getImage: (req, res) => {
        var file = req.params.imagen;
        var path_file = './upload/productos/' + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!!!'
                });
            }
        });
    },
    updateProducto: (req, res) => {
        var id = req.params.id;
        var params = req.body;

        /////////////////Conseguir el nombre y la extensión/////////////////////
        var file_path = req.files.file0.path; //<------Path del archivo
        var file_split = file_path.split('\\');
        var file_name = file_split[2];// <-------------Nombre del archivo
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1]; // <--------Extensión del archivo
        /////////////////Conseguir el nombre y la extensión/////////////////////

        ///////////////////Validar datos (validator)////////////
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
        ///////////////////Validar datos (validator)////////////

        ////////////////Validación de datos////////////////////////////////////
        if (!req.files.file0.originalFilename || (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif')) {
            fs.unlink(file_path, (err) => { // Unlink permite borrar un archivo
                return res.status(404).send({
                    status: 'error',
                    message: "Imagen inválida!!!"
                });
            });
            ////////////////Validación de datos////////////////////////////////////
        } else {
            //Borramos la imagen anterior para hacer update
            if (validate_nombre && validate_precio && validate_cantidad && validate_descripcion) {
                Producto.findOne({ _id: id }, (err, producto) => {
                    if (err || producto == null) {
                        //En caso que el Id del producto que se envía no sea válido se borra la imagen que se acaba de enviar
                        fs.unlink('./upload/productos/' + file_name, (err) => { // Unlink permite borrar un archivo
                            return res.status(210).send({
                                status: 'error',
                                message: 'No existe el producto!!!'
                            });
                        });
                    } else {
                        fs.unlink('./upload/productos/' + producto.imagen, (err) => { // Unlink permite borrar un archivo
                            if (err) {
                                return res.status(210).send({
                                    status: 'error',
                                    message: 'Error al borrar la imagen'
                                });
                            }
                        });
                        Producto.findOneAndUpdate({ _id: id },
                            {
                                nombre: params.nombre,
                                precio: params.precio,
                                cantidad: params.cantidad,
                                descripcion: params.descripcion,
                                imagen: file_name,
                                estado: params.estado
                            },
                            { new: true }, (err, producto) => { // { new : true} devuelve el objeto ya actualizado
                                if (err || producto == null) {
                                    return res.status(210).send({
                                        status: 'error',
                                        message: 'No existe el producto!!!'
                                    });
                                } else {
                                    return res.status(200).send({
                                        status: 'success',
                                        producto
                                    })
                                }
                            }
                        );
                    }
                });
            } else {
                fs.unlink(file_path, (err) => { // Unlink permite borrar un archivo
                    return res.status(210).send({
                        status: 'error',
                        message: 'Los datos no son válidos!!!'
                    });
                });
            }
        }
    },

}; // end controller

module.exports = controller;