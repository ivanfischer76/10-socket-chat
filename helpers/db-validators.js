
const Role = require('../models/role');
const { Usuario, Categoria, Producto }  = require('../models');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
            throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    // verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

const existeUsuarioPorId = async(id) => {
    // verificar si el id existe
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`NO existe usuario con id: ${id}`);
    }
}

// existeCategoriaPorId
const existeCategoriaPorId = async(id) => {
    // verificar si el id  existe
    const existeCategoria = await Categoria.findById(id);
    if(!existeCategoria){
        throw new Error(`No existe categoría con id: ${id}`);
    }
}

// existeProductoPorId
const existeProductoPorId = async(id) => {
    // verificar si el id  existe
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){
        throw new Error(`No existe producto con id: ${id}`);
    }
}

/**
 * Calidar conexiones permitidas
 */
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La colección ${coleccion} no es permitida. Las colecciones permitidas son: ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}