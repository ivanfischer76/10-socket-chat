const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, 
        actualizarImagen, 
        mostrarImagen, 
        actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos, validarArchivo } = require('../middelwares');

const router = Router();

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser un ID de mongodb').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
// para utilizar con heroku en cloudinary
], actualizarImagenCloudinary);
// para utilizar en un servidor dedicado
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un ID de mongodb').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

module.exports = router;