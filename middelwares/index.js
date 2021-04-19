
const validarJWT     = require('../middelwares/validar-jwt');
const validaRoles    = require('../middelwares/validar-roles');
const validarCampos  = require('../middelwares/validar_campos');
const validarArchivo = require('../middelwares/validar_archivo'); 

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo
}
