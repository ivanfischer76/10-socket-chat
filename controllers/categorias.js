const { request, response } = require('express');
const { Categoria } = require('../models');

// crear una nueva categoría
const crearCategoria = async(req = request, res = response) => {
    //comprobar si la categoría existe en la base de datos
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});
    if(categoriaDB){
        res.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }
    //generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    //guardar en DB
    await categoria.save();
    res.status(201).json(categoria);
}

// obtenerCategorias - paginado -total - populate
const obtenerCategorias = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    // de esta manera toma menos tiempo porque resuelve las dos promesas al mismo tiempo
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre') //para que muestre el nombre del usuario
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        enviados: limite,
        total,
        categorias
    });
}
// obtenerCategoría - populate {}
const obtenerCategoriaById = async(req = request, res = response) => {
    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

// actualizarCategoria
const actualizarCategoria = async(req =request, res = response) => {
    const id = req.params.id;
    const { estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    res.json(categoria);
}

// borrarCategoria - estado:false
const borrarCategoria = async(req =request, res = response) => {
    const id = req.params.id;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado: false}, {new: true});
    res.status(200).json(categoria);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCategoria,
    borrarCategoria
}