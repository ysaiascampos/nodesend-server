const Enlace = require('../models/Enlace');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const shortid = require('shortid');

exports.nuevoEnlace = async (req, res) => {
    // Mostrar mensaje de error de express validator
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Verificar si e usuario esta registrado

    const {  nombre_original } = req.body;
    // Crear un nuevo usuario
    const enlace = new Enlace();

    //generar enlace
    enlace.url = shortid.generate();
    enlace.nombre = shortid.generate();
    enlace.nombre_original = nombre_original;

    //Si el Usuario esta autenticado
    if(req.usuario){
        const {  password, descargas } = req.body;

        //Asignar a enlace el numero de descargas
        if(descargas){
            enlace.descargas = descargas;
        }
        // Hashear el password
        if(password){
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }
        //Asignar el autor
        enlace.autor = req.usuario.id;
    }
    
    try {
        enlace.save();
        res.json({msg : `Enlace creado correctamente url: ${enlace.url}`});
    } catch (error) {
        console.log(error);
        res.json({msg : 'Hubo un error'});
    }
    return next();
}