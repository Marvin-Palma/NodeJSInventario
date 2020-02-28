'use strict'

var validator = require('validator');
var Producto = require('../models/producto');
var fs = require('fs');
var path = require('path');

var controller = {

    save: (req, res) => {
        //Recoger fichero de la petición
        var file_name = 'Imagen no subida';

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //Conseguir el nombre y la extensión
        var file_path = req.files.file0.path; //<------Path
        var file_split = file_path.split('\\');

        // Nombre del archivo
        var file_name = file_split[2];// <-------------Nombre 
        //Extensión del archivo
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1]; // <--------Extensión

        //Comprobar la extensión

        if(file_ext != 'png' && file_ext!='jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //Borrar el archivo
            fs.unlink(file_path, (err)=>{ // Unlink permite borrar un archivo
                return res.status(210).send({
                    status: 'error',
                    message: 'La extensión no es válida'
                });
            }); 
        }
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
            return res.status(210).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }

    },

    getProductos: (req, res) =>{
        Producto.find({}, (err, productos)=>{
            if(err || productos.length <= 0){
                return res.status(210).send({
                    status: 'error',
                    message: 'No se encontraron productos'
                });
            }else{
                return res.status(200).send({
                    status:'success',
                    productos
                })
            }
        });
    },

    getImage: (req, res) => {
        var file = req.params.imagen;
        var path_file = './upload/productos/'+file;

        fs.exists(path_file, (exists)=>{
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe!!!'
                });
            }
        });
    }
}; // end controller

module.exports = controller;