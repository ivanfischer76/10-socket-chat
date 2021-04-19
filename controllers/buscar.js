const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); // TRUE
    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const cantidad = await Usuario.countDocuments({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });
    return res.json({
        cantidad,
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); // TRUE
    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const cantidad = await Categoria.countDocuments({nombre: regex, estado: true});
    const categorias = await Categoria.find({nombre: regex, estado: true});
    return res.json({
        cantidad,
        results: categorias
    });
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); // TRUE
    if(esMongoId){
        const producto = await Producto.findById(termino)
                                        .populate('categoria', 'nombre')
                                        .populate('usuario', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regex = new RegExp(termino, 'i');
    const cantidad = await Producto.countDocuments({nombre: regex, estado: true});
    const productos = await Producto.find({nombre: regex, estado: true})
                                    .populate('categoria', 'nombre')
                                    .populate('usuario', 'nombre');
    return res.json({
        cantidad,
        results: productos
    });
}

const buscar = (req = request, res = response) => {
    const { coleccion, termino } = req.params;
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvidó hacer esta búsqueda'
            });
            break;
    }
}

module.exports = {
    buscar
}