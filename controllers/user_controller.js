'use strict'

var validator = require('validator');
var User = require('../models/user');

//var fs = require('fs');
//var path = require('path');

var controller = {

    save:(req, res)=>{
        //Recoger parámetros por Post
        var params = req.body;
        //Validar datos (validator)
        try{
            var validate_correo = !validator.isEmpty(params.correo);
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(210).send({
                status: 'error',
                mensaje: 'Faltan datos por enviar'
            });
        }

        if(validate_correo && validate_password){
            //Crear el objeto a guardar
            var user = new User();
            //Asignar valores
            user.correo = params.correo;
            user.password = params.password;

            //Guardar el artículo
            user.save((err, userStored)=>{
                if(err || !userStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El usuario no se ha guardado'
                    });
                }
                //Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    user : userStored
                });
            });
            
        }else{
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son válidos'
            });
        }
        
    },
    
    getUser: (req, res)=>{
        var userCorreo = req.params.correo;
        var userPassword = req.params.password;

        if(!userCorreo || userCorreo == null){
            return res.status(210).send({
                status: 'error',
                message: 'Correo vacío.'
            });
        }

        User.findOne({correo:userCorreo}, (err, CorreoUser)=>{
            if(err || !CorreoUser){
                return res.status(210).send({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }else{
                if(userPassword===CorreoUser.password){
                    return res.status(200).send({
                        status: 'success',
                        message: 'Login exitoso!!!',
                        correo: CorreoUser.correo
                    });
                }
                return res.status(210).send({
                    status: 'error',
                    message: 'Credenciales inválidas.'
                });
            }

        });
    },
}; // end controller

module.exports = controller;