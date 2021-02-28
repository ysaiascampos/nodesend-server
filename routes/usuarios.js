const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check } = require('express-validator');

router.post('/',
    [
        check('email', 'Agrega un email valido').isEmail(),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min: 6})
    ],
    usuarioController.nuevoUsuario
);
module.exports = router;