
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// const { validarJWT } = require('../middelwares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middelwares/validar-roles');
// const { validarCampos } = require('../middelwares/validar_campos');
// lo anterior puede hacerse de la siguiente manera gracias al archivo index.js de la carpeta middlewares
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middelwares');

const router = Router();

//obtener un listado de usuarios
router.get('/', usuariosGet);

// actualizar un usuario
router.put('/:id', [
            check('id', 'No es in ID válido').isMongoId(),
            check('id').custom(existeUsuarioPorId),
            check('rol').custom(esRoleValido),
            validarCampos
        ], usuariosPut);

// crear un usuario
router.post('/', [
            check('nombre', 'El nombre es obligatorio').not().isEmpty(),
            check('password', 'El password es obligatorio y debe contener más de seis caracteres')
                .isLength({min: 6}),
            check('correo', 'El correo ingresado NO es válido').isEmail(),
            check('correo').custom( emailExiste ),
            //check('rol', 'El rol NO es válido').isIn(['ADMIN_ROLE','USER_ROLE']),
            check('rol').custom( esRoleValido ),
            validarCampos
        ], usuariosPost);

// borrar un usuario
router.delete('/:id', [
            validarJWT,
            // esAdminRole, // sólo si es administrador
            tieneRole('ADMIN_ROLE', 'USER_ROLE'), // sólo si posee alguno de los roles que se pasan como argument
            check('id', 'No es in ID válido').isMongoId(),
            check('id').custom(existeUsuarioPorId),
            validarCampos
        ], usuariosDelete);

// 
router.patch('/', usuariosPatch);

module.exports = router;