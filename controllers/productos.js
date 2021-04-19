
const { request, response } = require('express');
const { Producto } = require('../models');

// crear un nuevo producto
const crearProducto = async(req = request, res = response) => {
    //comprobar si el producto existe en la base de datos
    const { estado, usuario, ...body} = req.body;
    const productoDB = await Producto.findOne({nombre: body.nombre});
    
    if(productoDB){
        res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }
    //generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }
    const producto = new Producto(data);
    //guardar en DB
    await producto.save();
    res.status(201).json(producto)
}

// obtenerProductos - paginado -total - populate
const obtenerProductos = async(req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = {estado: true};

    // de esta manera toma menos tiempo porque resuelve las dos promesas al mismo tiempo
    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre') //para que muestre el nombre del usuario
        .populate('categoria', 'nombre') //para que muestre el nombre de la categoría
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        enviados: limite,
        total,
        productos
    });
}
// obtenerProducto - populate {}
const obtenerProductoById = async(req = request, res = response) => {
    const id = req.params.id;
    const producto = await Producto.findById(id)
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');

    res.json(producto);
}

// actualizarProducto
const actualizarProducto = async(req =request, res = response) => {
    const id = req.params.id;
    const { estado, usuario, ...data} = req.body;
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;
    const producto = await Producto.findByIdAndUpdate(id, data, {new: true})
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    res.json(producto);
}

// borrarProducto - estado:false
const borrarProducto = async(req =request, res = response) => {
    const id = req.params.id;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true})
                                    .populate('usuario', 'nombre')
                                    .populate('categoria', 'nombre');
    res.status(200).json(productoBorrado);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoById,
    actualizarProducto,
    borrarProducto
}