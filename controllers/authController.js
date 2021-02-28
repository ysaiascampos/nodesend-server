const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

exports.autenticarUsuario = async (req, res) => {

    // Mostrar mensaje de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Verificar si e usuario esta registrado

    const { email, password } = req.body;
    let usuario = await Usuario.findOne({email});

    if(!usuario){
        res.status(401).json({msg: 'El usuario no esta registrado'});
        return next();
    }

    //Verificar el password y autenticar el usuario

    if(bcrypt.compareSync(password, usuario.password)){
        // Crear JWT
        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.SECRETA, {
            expiresIn: '8h'
        });
        res.json({token});
    } else {
        res.status(401).json({msg: 'EL password es incorrecto'});
        return next();
    }
}

exports.usuarioAutenticado = (req, res) => {

    res.json({usuario: req.usuario});
}