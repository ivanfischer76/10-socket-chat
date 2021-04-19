const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignin } = require('../controllers/auth');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoriaById,
        actualizarCategoria, 
        borrarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    tieneRole
} = require('../middelwares');


const router = Router();

// Obtener todas las categorías - público
router.get('/', obtenerCategorias);

// Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoriaById);


// Crear una categoría - privado - cualquiera con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar una categoría - privado - cualquiera con un token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Admin
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'), // sólo si posee alguno de los roles que se pasan como argumento
    check('id', 'No es in ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;