const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, 
        obtenerProductos, 
        obtenerProductoById,
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    tieneRole
} = require('../middelwares');


const router = Router();

// Obtener todos los productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProductoById);


// Crear un producto - privado - cualquiera con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar un producto - privado - cualquiera con un token válido
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProductoPorId),
    check('id', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    check('categoria', 'No es un ID válido').isMongoId(),
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'), // sólo si posee alguno de los roles que se pasan como argumento
    check('id', 'No es in ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

module.exports = router;