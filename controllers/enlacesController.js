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

// obtener el enlace

exports.obtenerEnlace = async (req, res, next) => {
    const { url } = req.params;
    //Verificar si el enlace existe
    const enlace = await Enlace.findOne({ url });
    if(!enlace){
        res.status(404).json({msg: 'Ese enlace no existe'});
        return next();
    }
    //Si el enlace existe
    res.json({archivo: enlace.nombre});

    // Si las descargas son iguales a 1 - Borrar la entrada y borrar el archivo

    const { descargas, nombre } = enlace;

    if(descargas === 1){
        // Eliminar archivo
        req.archivo = nombre;

        // Eliminar de la base de datos
        await Enlace.findOneAndRemove(req.params.url);
        next();
    } else {
        enlace.descargas--;
        await enlace.save
        console.log('Aún hay descargas');
    }

    // Si las descargas son mayores a 1 - Restar 1
    
}